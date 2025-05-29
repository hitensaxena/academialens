import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import DocumentsClientTable from './table-client';

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    // Optionally, you could redirect to login or show a message
    return (
      <div className="text-center mt-10 text-red-600">You must be logged in to view documents.</div>
    );
  }
  const documents = await prisma.document.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return <DocumentsClientTable documents={JSON.parse(JSON.stringify(documents))} />;
}
