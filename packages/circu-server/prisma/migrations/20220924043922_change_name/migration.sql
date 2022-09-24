/*
  Warnings:

  - You are about to drop the `_roles_to_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_roles_to_roles" DROP CONSTRAINT "_roles_to_roles_A_fkey";

-- DropForeignKey
ALTER TABLE "_roles_to_roles" DROP CONSTRAINT "_roles_to_roles_B_fkey";

-- DropTable
DROP TABLE "_roles_to_roles";

-- CreateTable
CREATE TABLE "_parent_roles_to_child_roles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_parent_roles_to_child_roles_AB_unique" ON "_parent_roles_to_child_roles"("A", "B");

-- CreateIndex
CREATE INDEX "_parent_roles_to_child_roles_B_index" ON "_parent_roles_to_child_roles"("B");

-- AddForeignKey
ALTER TABLE "_parent_roles_to_child_roles" ADD CONSTRAINT "_parent_roles_to_child_roles_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_parent_roles_to_child_roles" ADD CONSTRAINT "_parent_roles_to_child_roles_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
