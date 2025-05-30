import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Get the file URL from the document
    const fileUrl = document.fileUrl;

    // Return a redirect to the file URL
    return NextResponse.redirect(fileUrl);
  } catch (error) {
    console.error('Error downloading document:', error);
    return NextResponse.json({ error: 'Failed to download document' }, { status: 500 });
  }
}
