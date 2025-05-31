import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink, mkdir, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { v2 as cloudinary } from 'cloudinary';
import { existsSync } from 'fs';

// Define the DocumentStatus enum locally since it's not being exported correctly
const DocumentStatus = {
  UPLOADING: 'UPLOADING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  QUEUED: 'QUEUED',
} as const;

type DocumentStatus = (typeof DocumentStatus)[keyof typeof DocumentStatus];

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to process document in the background
async function processDocument(documentId: string, metadata: any) {
  try {
    // Simulate document processing
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Update document status to completed
    await prisma.document.update({
      where: { id: documentId },
      data: {
        isProcessed: true,
        metadata: {
          ...(metadata || {}),
          status: 'COMPLETED',
          processedAt: new Date().toISOString(),
        },
      },
    });

    console.log('Document processing completed:', documentId);
  } catch (error) {
    console.error('Error in document processing:', error);

    // Update document status to failed
    try {
      await prisma.document.update({
        where: { id: documentId },
        data: {
          metadata: {
            ...(metadata || {}),
            status: 'FAILED',
            error: error instanceof Error ? error.message : 'Unknown error during processing',
            failedAt: new Date().toISOString(),
          },
        },
      });
    } catch (updateError) {
      console.error('Failed to update document status to failed:', updateError);
    }
  }
}

// Helper to convert a ReadableStream to a Buffer
async function streamToBuffer(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  console.log('=== UPLOAD REQUEST RECEIVED ===');

  // Declare variables at function scope
  let tempFilePath: string | undefined;

  interface DocumentWithMetadata {
    id: string;
    metadata: Record<string, any>;
    [key: string]: any;
  }

  let document: DocumentWithMetadata | null = null;

  try {
    // Get the session
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'Found' : 'Not found');

    if (!session?.user?.email) {
      console.error('Unauthorized: No user session found');
      return NextResponse.json(
        { error: 'Unauthorized: Please sign in to upload files' },
        { status: 401 },
      );
    }

    const userEmail = session.user.email;
    console.log('Authenticated user email:', userEmail);

    // Find the user in the database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      console.error('User not found in database:', userEmail);
      return NextResponse.json(
        { error: 'User account not found. Please contact support.' },
        { status: 404 },
      );
    }

    console.log('Found user in database with ID:', user.id);

    // Parse form data
    let formData;
    try {
      formData = await req.formData();
      console.log('Form data parsed successfully');
    } catch (error) {
      console.error('Error parsing form data:', error);
      return NextResponse.json(
        {
          error: 'Invalid form data format',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 400 },
      );
    }

    // Variables are now declared at function scope

    try {
      const file = formData.get('file') as File | null;
      if (!file) {
        throw new Error('No file provided');
      }

      // Create temp directory if it doesn't exist
      const tempDir = join(process.cwd(), 'temp');
      if (!existsSync(tempDir)) {
        await mkdir(tempDir, { recursive: true });
      }

      // Generate a unique ID for the file
      const uniqueId = uuidv4();

      // Create temp file path
      tempFilePath = join(tempDir, `${uniqueId}-${file.name}`);

      // Get file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';

      // Convert File to ArrayBuffer and then to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await writeFile(tempFilePath, buffer);

      // Verify file was written
      const stats = await stat(tempFilePath);
      if (stats.size === 0) {
        throw new Error('Failed to write file to disk - file is empty');
      }

      console.log('File saved to temporary location:', tempFilePath);

      // Upload to Cloudinary
      console.log('Uploading to Cloudinary...');
      const resourceType = ['pdf', 'docx', 'txt'].includes(fileExtension) ? 'raw' : 'auto';

      const result = await cloudinary.uploader.upload(tempFilePath, {
        resource_type: resourceType,
        public_id: `academialens/${uniqueId}`,
        chunk_size: 10 * 1024 * 1024, // 10MB chunks
        timeout: 60000, // 60 second timeout
      });

      console.log('Cloudinary upload successful:', {
        public_id: result.public_id,
        format: result.format,
        bytes: result.bytes,
      });

      if (!result.secure_url) {
        throw new Error('No secure URL returned from Cloudinary');
      }

      // Map file extension to FileType (using Prisma's FileType enum)
      type FileType = 'PDF' | 'TEXT' | 'DOCX' | 'URL' | 'VIDEO';
      let fileType: FileType = 'TEXT';

      switch (fileExtension) {
        case 'pdf':
          fileType = 'PDF';
          break;
        case 'docx':
        case 'doc':
          fileType = 'DOCX';
          break;
        case 'txt':
          fileType = 'TEXT';
          break;
        case 'mp4':
        case 'webm':
          fileType = 'VIDEO';
          break;
        case 'url':
          fileType = 'URL';
          break;
        case 'jpg':
        case 'jpeg':
        case 'png':
          // For images, we'll use TEXT type since IMAGE is not in the enum
          fileType = 'TEXT';
          break;
        default:
          fileType = 'TEXT';
      }

      // Create document with proper typing
      const documentData = await prisma.document.create({
        data: {
          title: file.name,
          fileUrl: result.secure_url,
          fileType: fileType,
          fileSize: file.size,
          userId: user.id,
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
          pageCount: 0,
          isProcessed: false,
          // Use type assertion to bypass TypeScript error
          ...({ status: DocumentStatus.UPLOADING } as any),
          metadata: {
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
            originalFilename: file.name,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      // Cast to our local type
      document = documentData as unknown as DocumentWithMetadata;

      // Update status to PROCESSING in the background
      await prisma.document.update({
        where: { id: document.id },
        data: {
          metadata: {
            ...((document.metadata as object) || {}),
            status: 'PROCESSING',
            processingStartedAt: new Date().toISOString(),
          },
        },
      });

      console.log('Document processing started:', document.id);

      if (!document) {
        throw new Error('Failed to create document record');
      }

      // Start document processing in the background
      processDocument(document.id, document.metadata || {});

      console.log('Document upload complete, processing started:', { documentId: document.id });

      return NextResponse.json(
        {
          success: true,
          documentId: document.id,
          status: 'PROCESSING',
        },
        { status: 200 },
      );
    } catch (error) {
      console.error('Error in upload handler:', error);

      // Clean up temp file if it exists
      if (typeof tempFilePath !== 'undefined' && tempFilePath && existsSync(tempFilePath)) {
        try {
          await unlink(tempFilePath);
        } catch (unlinkError) {
          console.error('Error cleaning up temp file:', unlinkError);
        }
      }

      // Try to update the document status to failed if we have a document
      if (document?.id) {
        try {
          await prisma.document.update({
            where: { id: document.id },
            data: {
              metadata: {
                ...(document.metadata || {}),
                status: 'FAILED',
                error: error instanceof Error ? error.message : 'Unknown error during upload',
                failedAt: new Date().toISOString(),
              },
            },
          });
        } catch (updateError) {
          console.error('Failed to update document status to failed:', updateError);
        }
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process file',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error in upload route:', error);

    // Clean up temp file if it exists
    if (typeof tempFilePath !== 'undefined' && tempFilePath && existsSync(tempFilePath)) {
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Error cleaning up temp file:', unlinkError);
      }
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
