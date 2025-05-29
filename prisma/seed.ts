import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
      // Add other required fields as per your schema (e.g., password if needed)
    },
  });

  // Create a project owned by the user
  const project = await prisma.project.create({
    data: {
      name: 'Test Project',
      userId: user.id, // Correct field for owner
      // Add other required fields as per your schema
    },
  });

  // Optionally, add the user as a member of the project if your schema requires
  // await prisma.projectMember.create({
  //   data: {
  //     userId: user.id,
  //     projectId: project.id,
  //     role: 'OWNER', // or other role if needed
  //   },
  // });

  console.log('Seeded user and project:');
  console.log('User ID:', user.id);
  console.log('Project ID:', project.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
