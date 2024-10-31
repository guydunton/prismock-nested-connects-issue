# Prismock nested connects

This shows a bug in Prismock with nested connects.

## To test

```
npm install
npx prisma migrate dev
npm run test
```

I've also provided a script which runs the same code against Prisma which does not error.

## The issue

The error appears as follows:

```
    TypeError: Cannot read properties of null (reading 'undefined')

      26 |
      27 |   // update address -> update user -> connect to groups
    > 28 |   const result = prisma.address.update({
         |                                 ^
      29 |     where: {
      30 |       id: address.id,
      31 |     },

      at getFieldFromRelationshipWhere (node_modules/prismock/src/lib/operations/find/find.ts:243:41)
      at node_modules/prismock/src/lib/operations/update.ts:56:62
          at Array.forEach (<anonymous>)
      at update (node_modules/prismock/src/lib/operations/update.ts:33:24)
      at current.getItems.reduce.toUpdate (node_modules/prismock/src/lib/operations/update.ts:225:30)
          at Array.reduce (<anonymous>)
      at updateMany (node_modules/prismock/src/lib/operations/update.ts:218:52)
      at Object.updateMany (node_modules/prismock/src/lib/delegate.ts:68:33)
      at node_modules/prismock/src/lib/operations/update.ts:147:24
          at Array.forEach (<anonymous>)
      at update (node_modules/prismock/src/lib/operations/update.ts:33:24)
      at current.getItems.reduce.toUpdate (node_modules/prismock/src/lib/operations/update.ts:225:30)
          at Array.reduce (<anonymous>)
      at updateMany (node_modules/prismock/src/lib/operations/update.ts:218:52)
      at Object.update (node_modules/prismock/src/lib/delegate.ts:64:33)
      at src/index.test.ts:28:33
      at fulfilled (src/index.test.ts:5:58)
```

I traced the issue through to [getFieldFromRelationshipWhere](https://github.com/morintd/prismock/blob/master/src/lib/operations/find/find.ts#L243) & found that relationToFields & relationFromFields were not set for unnamed pivot tables in Prisma (e.g. `_UserToUserGroup`).
