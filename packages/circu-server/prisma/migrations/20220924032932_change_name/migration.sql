/*
  Warnings:

  - You are about to drop the `_users_to_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_users_to_roles" DROP CONSTRAINT "_users_to_roles_A_fkey";

-- DropForeignKey
ALTER TABLE "_users_to_roles" DROP CONSTRAINT "_users_to_roles_B_fkey";

-- DropTable
DROP TABLE "_users_to_roles";

-- CreateTable
CREATE TABLE "_roles_to_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_roles_to_users_AB_unique" ON "_roles_to_users"("A", "B");

-- CreateIndex
CREATE INDEX "_roles_to_users_B_index" ON "_roles_to_users"("B");

-- AddForeignKey
ALTER TABLE "_roles_to_users" ADD CONSTRAINT "_roles_to_users_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roles_to_users" ADD CONSTRAINT "_roles_to_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
