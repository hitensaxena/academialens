import { NextRequest, NextResponse } from 'next/server';
import { uploadFile } from '@/lib/cloudinary';
import { prisma } from '@/lib/db/prisma';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { v4 as uuidv4 } from 'uuid';

// Configure the API to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Get the file from form data
    const file = formData.get('file') as unknown as File | null;

    if (!file || !(file instanceof File)) {
      console.error('No file found in the request or invalid file format');
      return NextResponse.json(
        { error: 'No file uploaded or invalid file format' },
        { status: 400 },
      );
    }

    console.log('Processing file:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // File validation
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return NextResponse.json({ error: 'File too large. Maximum size is 20MB.' }, { status: 400 });
    }

    // Get file extension and validate
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];

    if (!allowedExtensions.includes(fileExtension)) {
      console.error('Unsupported file extension:', fileExtension);
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' },
        { status: 400 },
      );
    }

    // Create a temporary directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tempDir, { recursive: true });

    // Create a unique filename
    const uniqueId = uuidv4();
    const tempFileName = `${Date.now()}_${uniqueId}.${fileExtension}`;
    const tempFilePath = path.join(tempDir, tempFileName);

    try {
      // Save file to temporary location using streaming
      const fileStream = file.stream();
      const buffer = await streamToBuffer(fileStream);
      await fs.writeFile(tempFilePath, buffer);

      // Verify file was written
      const stats = await fs.stat(tempFilePath);
      if (stats.size === 0) {
        throw new Error('Failed to write file to disk - file is empty');
      }

      console.log('File saved to temporary location:', tempFilePath);

      // Upload to Cloudinary
      console.log('Uploading to Cloudinary...');
      const resourceType = ['pdf', 'docx', 'txt'].includes(fileExtension) ? 'raw' : 'auto';

      const result = await uploadFile(tempFilePath, {
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

      // Map file extension to FileType
      let fileType: 'PDF' | 'TEXT' | 'DOCX' | 'URL' | 'VIDEO' = 'TEXT';

      switch (fileExtension) {
        case 'pdf':
          fileType = 'PDF';
          break;
        case 'docx':
        case 'doc':
          fileType = 'DOCX';
          break;
        case 'mp4':
        case 'webm':
        case 'mov':
          fileType = 'VIDEO';
          break;
        case 'url':
          fileType = 'URL';
          break;
        default:
          fileType = 'TEXT';
      }

      // Save to database
      const document = await prisma.document.create({
        data: {
          title: file.name,
          fileUrl: result.secure_url,
          fileType: fileType,
          fileSize: file.size,
          userId: user.id, // Use the user's ID instead of email
          description: `Uploaded on ${new Date().toLocaleDateString()}`,
          pageCount: 0,
          isProcessed: false,
          metadata: {
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type,
            originalFilename: file.name,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      console.log('Document saved to database:', { documentId: document.id });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        type: file.type,
        size: file.size,
        id: document.id,
      });
    } catch (uploadError) {
      console.error('Error during file processing:', uploadError);

      // Clean up temp file if it exists
      try {
        await fs.access(tempFilePath);
        await fs.unlink(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }

      return NextResponse.json(
        {
          error: 'Failed to process file upload',
          details: uploadError instanceof Error ? uploadError.message : 'Unknown error',
          stack:
            process.env.NODE_ENV === 'development' && uploadError instanceof Error
              ? uploadError.stack
              : undefined,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Unexpected error in upload handler:', error);
    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 },
    );
  }
}
