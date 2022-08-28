/*
  Warnings:

  - You are about to drop the `_doc_administrators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_doc_collaborators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_doc_readers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `doc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_doc_administrators" DROP CONSTRAINT "_doc_administrators_A_fkey";

-- DropForeignKey
ALTER TABLE "_doc_administrators" DROP CONSTRAINT "_doc_administrators_B_fkey";

-- DropForeignKey
ALTER TABLE "_doc_collaborators" DROP CONSTRAINT "_doc_collaborators_A_fkey";

-- DropForeignKey
ALTER TABLE "_doc_collaborators" DROP CONSTRAINT "_doc_collaborators_B_fkey";

-- DropForeignKey
ALTER TABLE "_doc_readers" DROP CONSTRAINT "_doc_readers_A_fkey";

-- DropForeignKey
ALTER TABLE "_doc_readers" DROP CONSTRAINT "_doc_readers_B_fkey";

-- DropForeignKey
ALTER TABLE "doc" DROP CONSTRAINT "doc_authorId_fkey";

-- DropForeignKey
ALTER TABLE "doc" DROP CONSTRAINT "doc_parentDocId_fkey";

-- DropTable
DROP TABLE "_doc_administrators";

-- DropTable
DROP TABLE "_doc_collaborators";

-- DropTable
DROP TABLE "_doc_readers";

-- DropTable
DROP TABLE "doc";

-- CreateTable
CREATE TABLE "wiki_doc" (
    "id" TEXT NOT NULL,
    "lastModify" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "parentDocId" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "wiki_doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_doc" (
    "id" TEXT NOT NULL,
    "lastModify" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentFolderId" TEXT,

    CONSTRAINT "general_doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folder" (
    "id" TEXT NOT NULL,
    "lastModify" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "parentFolderId" TEXT,

    CONSTRAINT "folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_general_doc_administrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_general_doc_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_general_doc_readers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_folder_administrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_folder_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_folder_readers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_wiki_doc_administrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_wiki_doc_collaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_wiki_doc_readers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_general_doc_administrators_AB_unique" ON "_general_doc_administrators"("A", "B");

-- CreateIndex
CREATE INDEX "_general_doc_administrators_B_index" ON "_general_doc_administrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_general_doc_collaborators_AB_unique" ON "_general_doc_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_general_doc_collaborators_B_index" ON "_general_doc_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_general_doc_readers_AB_unique" ON "_general_doc_readers"("A", "B");

-- CreateIndex
CREATE INDEX "_general_doc_readers_B_index" ON "_general_doc_readers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_folder_administrators_AB_unique" ON "_folder_administrators"("A", "B");

-- CreateIndex
CREATE INDEX "_folder_administrators_B_index" ON "_folder_administrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_folder_collaborators_AB_unique" ON "_folder_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_folder_collaborators_B_index" ON "_folder_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_folder_readers_AB_unique" ON "_folder_readers"("A", "B");

-- CreateIndex
CREATE INDEX "_folder_readers_B_index" ON "_folder_readers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_wiki_doc_administrators_AB_unique" ON "_wiki_doc_administrators"("A", "B");

-- CreateIndex
CREATE INDEX "_wiki_doc_administrators_B_index" ON "_wiki_doc_administrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_wiki_doc_collaborators_AB_unique" ON "_wiki_doc_collaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_wiki_doc_collaborators_B_index" ON "_wiki_doc_collaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_wiki_doc_readers_AB_unique" ON "_wiki_doc_readers"("A", "B");

-- CreateIndex
CREATE INDEX "_wiki_doc_readers_B_index" ON "_wiki_doc_readers"("B");

-- AddForeignKey
ALTER TABLE "wiki_doc" ADD CONSTRAINT "wiki_doc_parentDocId_fkey" FOREIGN KEY ("parentDocId") REFERENCES "wiki_doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_doc" ADD CONSTRAINT "wiki_doc_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "general_doc" ADD CONSTRAINT "general_doc_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "general_doc" ADD CONSTRAINT "general_doc_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_general_doc_administrators" ADD CONSTRAINT "_general_doc_administrators_A_fkey" FOREIGN KEY ("A") REFERENCES "general_doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_general_doc_administrators" ADD CONSTRAINT "_general_doc_administrators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_general_doc_collaborators" ADD CONSTRAINT "_general_doc_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "general_doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_general_doc_collaborators" ADD CONSTRAINT "_general_doc_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_general_doc_readers" ADD CONSTRAINT "_general_doc_readers_A_fkey" FOREIGN KEY ("A") REFERENCES "general_doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_general_doc_readers" ADD CONSTRAINT "_general_doc_readers_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folder_administrators" ADD CONSTRAINT "_folder_administrators_A_fkey" FOREIGN KEY ("A") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folder_administrators" ADD CONSTRAINT "_folder_administrators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folder_collaborators" ADD CONSTRAINT "_folder_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folder_collaborators" ADD CONSTRAINT "_folder_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folder_readers" ADD CONSTRAINT "_folder_readers_A_fkey" FOREIGN KEY ("A") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_folder_readers" ADD CONSTRAINT "_folder_readers_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wiki_doc_administrators" ADD CONSTRAINT "_wiki_doc_administrators_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wiki_doc_administrators" ADD CONSTRAINT "_wiki_doc_administrators_B_fkey" FOREIGN KEY ("B") REFERENCES "wiki_doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wiki_doc_collaborators" ADD CONSTRAINT "_wiki_doc_collaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wiki_doc_collaborators" ADD CONSTRAINT "_wiki_doc_collaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "wiki_doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wiki_doc_readers" ADD CONSTRAINT "_wiki_doc_readers_A_fkey" FOREIGN KEY ("A") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_wiki_doc_readers" ADD CONSTRAINT "_wiki_doc_readers_B_fkey" FOREIGN KEY ("B") REFERENCES "wiki_doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;
