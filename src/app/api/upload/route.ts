import { NextRequest, NextResponse } from 'next/server';
import { uploadFile, getSecureUrl } from '@/lib/cloudinary';
import { prisma } from '@/lib/db/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  // Parse the incoming form data
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Validate file type and size
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];
  const maxSize = 20 * 1024 * 1024; // 20MB

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 });
  }

  // Save file temporarily to disk
  const tempDir = path.join(process.cwd(), 'tmp');
  await fs.mkdir(tempDir, { recursive: true });
  const tempFilePath = path.join(tempDir, `${Date.now()}_${file.name}`);
  const arrayBuffer = await file.arrayBuffer();
  await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

  try {
    // Upload to Cloudinary
    // Set resource_type to 'raw' for non-image files
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const resourceType = ['pdf', 'docx', 'txt'].includes(fileExtension ?? '') ? 'raw' : 'auto';
    const result = await uploadFile(tempFilePath, { resource_type: resourceType });
    // Clean up temp file
    await fs.unlink(tempFilePath);

    // Store document metadata in the database
    // TODO: Replace userId and projectId with real values from session/context
    const userId = 'cmb8lagsc0000rmnszscxwhce';
    const projectId = 'cmb8lagsg0002rmns6reo5x7o';
    const fileType = result.format === 'pdf' ? 'PDF' : result.format === 'docx' ? 'DOCX' : 'TXT';
    const document = await prisma.document.create({
      data: {
        title: file.name,
        // Use Cloudinary's raw URL for direct access
        fileUrl: getSecureUrl(result.public_id, { resource_type: resourceType }),
        fileType,
        fileSize: result.bytes,
        userId,
        projectId,
        metadata: {
          public_id: result.public_id,
        },
      },
    });

    // Return Cloudinary and DB result
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      size: result.bytes,
      type: result.format,
      documentId: document.id,
    });
  } catch (err) {
    // Only try to delete the temp file if it exists
    try {
      await fs.access(tempFilePath);
      await fs.unlink(tempFilePath);
    } catch {}
    return NextResponse.json({ error: 'Upload failed', details: String(err) }, { status: 500 });
  }
}
