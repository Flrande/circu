-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_docId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_folderId_fkey";

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "docId" DROP NOT NULL,
ALTER COLUMN "folderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_docId_fkey" FOREIGN KEY ("docId") REFERENCES "doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
