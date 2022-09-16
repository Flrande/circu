/*
  Warnings:

  - You are about to drop the column `parentRoleId` on the `Role` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_parentRoleId_fkey";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "parentRoleId";

-- CreateTable
CREATE TABLE "_role_parent" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_role_parent_AB_unique" ON "_role_parent"("A", "B");

-- CreateIndex
CREATE INDEX "_role_parent_B_index" ON "_role_parent"("B");

-- AddForeignKey
ALTER TABLE "_role_parent" ADD CONSTRAINT "_role_parent_A_fkey" FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_role_parent" ADD CONSTRAINT "_role_parent_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
