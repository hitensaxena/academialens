import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { deleteFile } from '@/lib/cloudinary';

// DELETE /api/documents/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Find the document
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    // Delete from Cloudinary if public_id exists
    let publicId: string | undefined;
    if (document.metadata) {
      // If metadata is a string, parse it; otherwise, use directly
      const meta =
        typeof document.metadata === 'string' ? JSON.parse(document.metadata) : document.metadata;
      publicId = meta?.public_id;
    }
    if (publicId) {
      await deleteFile(publicId);
    }
    // Delete from database
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Deletion failed', details: String(err) }, { status: 500 });
  }
}
