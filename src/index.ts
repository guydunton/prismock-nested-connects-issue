import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const group1 = await prisma.userGroup.create({
    data: {
      name: 'admins',
    },
  });
  const address = await prisma.address.create({
    data: {
      address: '123 Fake Street',
      User: {
        create: {
          name: 'Admin1',
        },
      },
    },
    select: {
      id: true,
      User: true,
    },
  });

  const userId = address.User[0].id;

  // update address -> update user -> connect to groups
  const result = prisma.address.update({
    where: {
      id: address.id,
    },
    data: {
      address: '142 New Street',
      User: {
        update: {
          where: {
            id: userId,
          },
          data: {
            name: 'Administrator 1',
            groups: {
              connect: [{ id: group1.id }],
            },
          },
        },
      },
    },
  });
  try {
    await result;
    console.log('Finished without issue');
  } catch (err) {
    console.log('Errored');
  }
}

main();
