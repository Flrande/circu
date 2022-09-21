/*
  Warnings:

  - Added the required column `last_deleted` to the `doc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "doc" ADD COLUMN     "last_deleted" TIMESTAMP(3) NOT NULL;
