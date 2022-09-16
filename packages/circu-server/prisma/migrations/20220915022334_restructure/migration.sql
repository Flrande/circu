/*
  Warnings:

  - You are about to drop the `_folder_administrators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_folder_collaborators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_folder_readers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_general_doc_administrators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_general_doc_collaborators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_general_doc_readers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_wiki_doc_administrators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_wiki_doc_collaborators` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_wiki_doc_readers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `general_doc` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wiki_doc` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `folder` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DocType" AS ENUM ('GENERAL', 'WIKI');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('ADMINISTRATOR', 'COLLABORATOR', 'READER');

-- DropForeignKey
ALTER TABLE "_folder_administrators" DROP CONSTRAINT "_folder_administrators_A_fkey";

-- DropForeignKey
ALTER TABLE "_folder_administrators" DROP CONSTRAINT "_folder_administrators_B_fkey";

-- DropForeignKey
ALTER TABLE "_folder_collaborators" DROP CONSTRAINT "_folder_collaborators_A_fkey";

-- DropForeignKey
ALTER TABLE "_folder_collaborators" DROP CONSTRAINT "_folder_collaborators_B_fkey";

-- DropForeignKey
ALTER TABLE "_folder_readers" DROP CONSTRAINT "_folder_readers_A_fkey";

-- DropForeignKey
ALTER TABLE "_folder_readers" DROP CONSTRAINT "_folder_readers_B_fkey";

-- DropForeignKey
ALTER TABLE "_general_doc_administrators" DROP CONSTRAINT "_general_doc_administrators_A_fkey";

-- DropForeignKey
ALTER TABLE "_general_doc_administrators" DROP CONSTRAINT "_general_doc_administrators_B_fkey";

-- DropForeignKey
ALTER TABLE "_general_doc_collaborators" DROP CONSTRAINT "_general_doc_collaborators_A_fkey";

-- DropForeignKey
ALTER TABLE "_general_doc_collaborators" DROP CONSTRAINT "_general_doc_collaborators_B_fkey";

-- DropForeignKey
ALTER TABLE "_general_doc_readers" DROP CONSTRAINT "_general_doc_readers_A_fkey";

-- DropForeignKey
ALTER TABLE "_general_doc_readers" DROP CONSTRAINT "_general_doc_readers_B_fkey";

-- DropForeignKey
ALTER TABLE "_wiki_doc_administrators" DROP CONSTRAINT "_wiki_doc_administrators_A_fkey";

-- DropForeignKey
ALTER TABLE "_wiki_doc_administrators" DROP CONSTRAINT "_wiki_doc_administrators_B_fkey";

-- DropForeignKey
ALTER TABLE "_wiki_doc_collaborators" DROP CONSTRAINT "_wiki_doc_collaborators_A_fkey";

-- DropForeignKey
ALTER TABLE "_wiki_doc_collaborators" DROP CONSTRAINT "_wiki_doc_collaborators_B_fkey";

-- DropForeignKey
ALTER TABLE "_wiki_doc_readers" DROP CONSTRAINT "_wiki_doc_readers_A_fkey";

-- DropForeignKey
ALTER TABLE "_wiki_doc_readers" DROP CONSTRAINT "_wiki_doc_readers_B_fkey";

-- DropForeignKey
ALTER TABLE "general_doc" DROP CONSTRAINT "general_doc_authorId_fkey";

-- DropForeignKey
ALTER TABLE "general_doc" DROP CONSTRAINT "general_doc_parentFolderId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_doc" DROP CONSTRAINT "wiki_doc_authorId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_doc" DROP CONSTRAINT "wiki_doc_parentDocId_fkey";

-- AlterTable
ALTER TABLE "folder" ADD COLUMN     "authorId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_folder_administrators";

-- DropTable
DROP TABLE "_folder_collaborators";

-- DropTable
DROP TABLE "_folder_readers";

-- DropTable
DROP TABLE "_general_doc_administrators";

-- DropTable
DROP TABLE "_general_doc_collaborators";

-- DropTable
DROP TABLE "_general_doc_readers";

-- DropTable
DROP TABLE "_wiki_doc_administrators";

-- DropTable
DROP TABLE "_wiki_doc_collaborators";

-- DropTable
DROP TABLE "_wiki_doc_readers";

-- DropTable
DROP TABLE "general_doc";

-- DropTable
DROP TABLE "wiki_doc";

-- CreateTable
CREATE TABLE "doc" (
    "id" TEXT NOT NULL,
    "lastModify" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "survivalStatus" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE',
    "type" "DocType" NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentFolderId" TEXT,
    "parentDocId" TEXT,

    CONSTRAINT "doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "docId" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "parentRoleId" TEXT,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_parentFolderId_fkey" FOREIGN KEY ("parentFolderId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_parentDocId_fkey" FOREIGN KEY ("parentDocId") REFERENCES "doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_docId_fkey" FOREIGN KEY ("docId") REFERENCES "doc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_parentRoleId_fkey" FOREIGN KEY ("parentRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
