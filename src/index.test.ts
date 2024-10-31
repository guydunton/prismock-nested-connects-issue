import { PrismockClient } from 'prismock';

/**
 * This test fails
 */
it('does not error connecting through 2 references', async () => {
  const prisma = new PrismockClient();
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
      User: {
        update: {
          where: {
            id: userId,
          },
          data: {
            groups: {
              connect: [{ id: group1.id }],
            },
          },
        },
      },
    },
  });

  await expect(result).resolves.not.toThrow();
});

/**
 * This test runs correctly proving that nested updates work
 */
it('does not error updating through 3 references', async () => {
  const prisma = new PrismockClient();
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

  // update address -> update user -> edit group
  const result = prisma.address.update({
    where: {
      id: address.id,
    },
    data: {
      User: {
        update: {
          where: {
            id: userId,
          },
          data: {
            groups: {
              updateMany: {
                where: {
                  id: group1.id,
                },
                data: {
                  name: 'Administrators',
                },
              },
            },
          },
        },
      },
    },
  });

  await expect(result).resolves.not.toThrow();
});
