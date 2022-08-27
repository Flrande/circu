/*
  Warnings:

  - You are about to drop the `_DocAdministrators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DocCollaborators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_DocReaders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_DocAdministrators" DROP CONSTRAINT "_DocAdministrators_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocAdministrators" DROP CONSTRAINT "_DocAdministrators_B_fkey";

-- DropForeignKey
ALTER TABLE "_DocCollaborators" DROP CONSTRAINT "_DocCollaborators_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocCollaborators" DROP CONSTRAINT "_DocCollaborators_B_fkey";

-- DropForeignKey
ALTER TABLE "_DocReaders" DROP CONSTRAINT "_DocReaders_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocReaders" DROP CONSTRAINT "_DocReaders_B_fkey";

-- DropTable
DROP TABLE "_DocAdministrators";

-- DropTable
DROP TABLE "_DocCollaborators";

-- DropTable
DROP TABLE "_DocReaders";

-- CreateTable
CREATE TABLE "_doc_administrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_doc_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_doc_readers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_doc_administrators_AB_unique" ON "_doc_administrators"("A", "B");

-- CreateIndex
CREATE INDEX "_doc_administrators_B_index" ON "_doc_administrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_doc_collaborators_AB_unique" ON "_doc_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_doc_collaborators_B_index" ON "_doc_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_doc_readers_AB_unique" ON "_doc_readers"("A", "B");

-- CreateIndex
CREATE INDEX "_doc_readers_B_index" ON "_doc_readers"("B");

-- AddForeignKey
ALTER TABLE "_doc_administrators" ADD CONSTRAINT "_doc_administrators_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_doc_administrators" ADD CONSTRAINT "_doc_administrators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_doc_collaborators" ADD CONSTRAINT "_doc_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_doc_collaborators" ADD CONSTRAINT "_doc_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_doc_readers" ADD CONSTRAINT "_doc_readers_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_doc_readers" ADD CONSTRAINT "_doc_readers_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
