/*
  Warnings:

  - You are about to drop the `_RoleToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_role_parent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_role_parent" DROP CONSTRAINT "_role_parent_A_fkey";

-- DropForeignKey
ALTER TABLE "_role_parent" DROP CONSTRAINT "_role_parent_B_fkey";

-- DropTable
DROP TABLE "_RoleToUser";

-- DropTable
DROP TABLE "_role_parent";

-- CreateTable
CREATE TABLE "_users_to_roles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_roles_to_roles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_to_roles_AB_unique" ON "_users_to_roles"("A", "B");

-- CreateIndex
CREATE INDEX "_users_to_roles_B_index" ON "_users_to_roles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_roles_to_roles_AB_unique" ON "_roles_to_roles"("A", "B");

-- CreateIndex
CREATE INDEX "_roles_to_roles_B_index" ON "_roles_to_roles"("B");

-- AddForeignKey
ALTER TABLE "_users_to_roles" ADD CONSTRAINT "_users_to_roles_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_to_roles" ADD CONSTRAINT "_users_to_roles_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roles_to_roles" ADD CONSTRAINT "_roles_to_roles_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roles_to_roles" ADD CONSTRAINT "_roles_to_roles_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
