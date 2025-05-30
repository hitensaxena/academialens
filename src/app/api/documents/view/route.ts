import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';
import { getSecureUrl } from '@/lib/cloudinary';

// POST /api/documents/view
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { documentId } = await req.json();

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    // Find the document
    const document = await prisma.document.findUnique({
      where: { id: documentId, userId: session.user.id },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Get metadata
    const metadata =
      typeof document.metadata === 'string'
        ? JSON.parse(document.metadata)
        : document.metadata || {};

    // Generate a secure URL
    const publicId = metadata.public_id;
    const resourceType = metadata.resource_type || 'auto';

    if (!publicId) {
      // If no public_id, return the stored URL
      return NextResponse.json({ url: document.fileUrl });
    }

    // Generate a secure URL
    const secureUrl = getSecureUrl(publicId, { resource_type: resourceType });

    return NextResponse.json({ url: secureUrl });
  } catch (error) {
    console.error('Error generating view URL:', error);
    return NextResponse.json({ error: 'Failed to generate view URL' }, { status: 500 });
  }
}
