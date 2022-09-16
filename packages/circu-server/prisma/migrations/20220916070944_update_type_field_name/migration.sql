/*
  Warnings:

  - You are about to drop the column `type` on the `doc` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `role` table. All the data in the column will be lost.
  - Added the required column `doc_type` to the `doc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_type` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doc" DROP COLUMN "type",
ADD COLUMN     "doc_type" "DocType" NOT NULL;

-- AlterTable
ALTER TABLE "role" DROP COLUMN "type",
ADD COLUMN     "role_type" "RoleType" NOT NULL;
