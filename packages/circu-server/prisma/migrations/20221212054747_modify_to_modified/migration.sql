/*
  Warnings:

  - You are about to drop the column `last_modify` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `last_modify` on the `folder` table. All the data in the column will be lost.
  - Added the required column `last_modified` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_modified` to the `folder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doc" DROP COLUMN "last_modify",
ADD COLUMN     "last_modified" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "folder" DROP COLUMN "last_modify",
ADD COLUMN     "last_modified" TIMESTAMP(3) NOT NULL;
