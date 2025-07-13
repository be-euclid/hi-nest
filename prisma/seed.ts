import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const categories = ['announcement', 'qna', 'misc'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Categories seeded.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());