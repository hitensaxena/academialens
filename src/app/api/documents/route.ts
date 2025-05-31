import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/db/prisma';

// GET /api/documents
export async function GET() {
  try {
    // Get the session
    const session = await getServerSession(authOptions);

    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!session.user?.id) {
      console.error('No user ID in session:', { session });
      return NextResponse.json({ error: 'Invalid session data' }, { status: 401 });
    }

    console.log('Fetching documents for user:', session.user.id);

    // Check database connection
    try {
      await prisma.$connect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        {
          error: 'Database connection error',
          details: process.env.NODE_ENV === 'development' ? String(dbError) : undefined,
        },
        { status: 500 },
      );
    }

    // Fetch documents
    const documents = await prisma.document.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        fileType: true,
        fileSize: true,
        pageCount: true,
        isProcessed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`Found ${documents.length} documents for user ${session.user.id}`);

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error in documents API route:', error);

    // Return more detailed error in development
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Failed to fetch documents',
        message: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack }),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } finally {
    // Disconnect from Prisma to avoid too many connections
    await prisma.$disconnect().catch(console.error);
  }
}
