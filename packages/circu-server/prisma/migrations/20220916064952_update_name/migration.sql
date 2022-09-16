/*
  Warnings:

  - You are about to drop the column `authorId` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `lastModify` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `parentDocId` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `parentFolderId` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `survivalStatus` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `folder` table. All the data in the column will be lost.
  - You are about to drop the column `lastModify` on the `folder` table. All the data in the column will be lost.
  - You are about to drop the column `parentFolderId` on the `folder` table. All the data in the column will be lost.
  - You are about to drop the column `survivalStatus` on the `folder` table. All the data in the column will be lost.
  - You are about to drop the column `survivalStatus` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `author_id` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_modify` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_modify` to the `folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_docId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_folderId_fkey";

-- DropForeignKey
ALTER TABLE "_RoleToUser" DROP CONSTRAINT "_RoleToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_role_parent" DROP CONSTRAINT "_role_parent_A_fkey";

-- DropForeignKey
ALTER TABLE "_role_parent" DROP CONSTRAINT "_role_parent_B_fkey";

-- DropForeignKey
ALTER TABLE "doc" DROP CONSTRAINT "doc_authorId_fkey";

-- DropForeignKey
ALTER TABLE "doc" DROP CONSTRAINT "doc_parentDocId_fkey";

-- DropForeignKey
ALTER TABLE "doc" DROP CONSTRAINT "doc_parentFolderId_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_authorId_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_parentFolderId_fkey";

-- AlterTable
ALTER TABLE "doc" DROP COLUMN "authorId",
DROP COLUMN "lastModify",
DROP COLUMN "parentDocId",
DROP COLUMN "parentFolderId",
DROP COLUMN "survivalStatus",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "last_modify" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "parent_doc_id" TEXT,
ADD COLUMN     "parent_folder_id" TEXT,
ADD COLUMN     "survival_status" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';

-- AlterTable
ALTER TABLE "folder" DROP COLUMN "authorId",
DROP COLUMN "lastModify",
DROP COLUMN "parentFolderId",
DROP COLUMN "survivalStatus",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "last_modify" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "parent_folder_id" TEXT,
ADD COLUMN     "survival_status" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "survivalStatus",
ADD COLUMN     "survival_status" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';

-- DropTable
DROP TABLE "Role";

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "doc_id" TEXT,
    "folder_id" TEXT,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_parent_doc_id_fkey" FOREIGN KEY ("parent_doc_id") REFERENCES "doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_doc_id_fkey" FOREIGN KEY ("doc_id") REFERENCES "doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_role_parent" ADD CONSTRAINT "_role_parent_A_fkey" FOREIGN KEY ("A") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_role_parent" ADD CONSTRAINT "_role_parent_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
