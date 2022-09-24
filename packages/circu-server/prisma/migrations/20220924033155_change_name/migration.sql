/*
  Warnings:

  - You are about to drop the `_users_to_docs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_users_to_folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_users_to_docs" DROP CONSTRAINT "_users_to_docs_A_fkey";

-- DropForeignKey
ALTER TABLE "_users_to_docs" DROP CONSTRAINT "_users_to_docs_B_fkey";

-- DropForeignKey
ALTER TABLE "_users_to_folders" DROP CONSTRAINT "_users_to_folders_A_fkey";

-- DropForeignKey
ALTER TABLE "_users_to_folders" DROP CONSTRAINT "_users_to_folders_B_fkey";

-- DropTable
DROP TABLE "_users_to_docs";

-- DropTable
DROP TABLE "_users_to_folders";

-- CreateTable
CREATE TABLE "_folders_to_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_docs_to_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_folders_to_users_AB_unique" ON "_folders_to_users"("A", "B");

-- CreateIndex
CREATE INDEX "_folders_to_users_B_index" ON "_folders_to_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_docs_to_users_AB_unique" ON "_docs_to_users"("A", "B");

-- CreateIndex
CREATE INDEX "_docs_to_users_B_index" ON "_docs_to_users"("B");

-- AddForeignKey
ALTER TABLE "_folders_to_users" ADD CONSTRAINT "_folders_to_users_A_fkey" FOREIGN KEY ("A") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folders_to_users" ADD CONSTRAINT "_folders_to_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_docs_to_users" ADD CONSTRAINT "_docs_to_users_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_docs_to_users" ADD CONSTRAINT "_docs_to_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
