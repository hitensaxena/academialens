import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

// Type for the document status response
interface DocumentMetadata {
  status?: string;
  publicId?: string;
  format?: string;
  resourceType?: string;
  originalFilename?: string;
  uploadedAt?: string;
  processingStartedAt?: string;
  processedAt?: string;
  error?: string;
  pages?: number;
  textLength?: number;
  extractedFields?: Record<string, unknown>;
}

interface DocumentStatusResponse {
  id: string;
  title: string;
  status: string;
  error?: string | null;
  processedAt?: Date | null;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: DocumentMetadata;
  message: string;
  estimatedTimeRemaining?: number;
}

// Type for the document metadata
interface DocumentMetadata {
  status?: string;
  publicId?: string;
  format?: string;
  resourceType?: string;
  originalFilename?: string;
  uploadedAt?: string;
  processingStartedAt?: string;
  processedAt?: string;
  error?: string;
  pages?: number;
  textLength?: number;
  extractedFields?: Record<string, unknown>;
  [key: string]: string | number | boolean | Record<string, unknown> | undefined;
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // First get the document with all fields we need
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        createdAt: true,
        updatedAt: true,
        metadata: true,
        isProcessed: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Parse the metadata
    const metadata = (document.metadata || {}) as DocumentMetadata;

    // Get the status from metadata, or infer it from isProcessed if not set
    let status = metadata.status || 'UNKNOWN';
    if (status === 'UNKNOWN') {
      status = document.isProcessed ? 'COMPLETED' : 'QUEUED';
    }

    // Create response object with proper typing
    const response: DocumentStatusResponse = {
      id: document.id,
      title: document.title,
      fileUrl: document.fileUrl,
      fileType: document.fileType,
      fileSize: document.fileSize,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      metadata,
      status,
      message: '',
      error: metadata.error || null,
      processedAt: metadata.processedAt ? new Date(metadata.processedAt) : null,
    };

    // Set appropriate message based on status
    const processingTime = new Date().getTime() - document.createdAt.getTime();
    const maxProcessingTime = 2 * 60 * 1000; // 2 minutes max processing time

    if (status === 'UPLOADING' || status === 'PROCESSING') {
      const estimatedTimeRemaining = Math.max(0, maxProcessingTime - processingTime);

      response.message =
        status === 'UPLOADING' ? 'Document is being uploaded' : 'Document is being processed';

      if (estimatedTimeRemaining > 0) {
        response.estimatedTimeRemaining = estimatedTimeRemaining;
      }
    } else if (status === 'COMPLETED') {
      response.message = 'Processing complete';
    } else if (status === 'FAILED') {
      response.message = 'Processing failed';
    } else {
      response.message = 'Document is queued for processing';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching document status:', error);
    return NextResponse.json({ error: 'Failed to fetch document status' }, { status: 500 });
  }
}
