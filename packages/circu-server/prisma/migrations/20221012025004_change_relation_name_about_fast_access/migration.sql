/*
  Warnings:

  - You are about to drop the `_docs_to_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_docs_to_users" DROP CONSTRAINT "_docs_to_users_A_fkey";

-- DropForeignKey
ALTER TABLE "_docs_to_users" DROP CONSTRAINT "_docs_to_users_B_fkey";

-- DropTable
DROP TABLE "_docs_to_users";

-- CreateTable
CREATE TABLE "_fast_access_docs_to_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_fast_access_docs_to_users_AB_unique" ON "_fast_access_docs_to_users"("A", "B");

-- CreateIndex
CREATE INDEX "_fast_access_docs_to_users_B_index" ON "_fast_access_docs_to_users"("B");

-- AddForeignKey
ALTER TABLE "_fast_access_docs_to_users" ADD CONSTRAINT "_fast_access_docs_to_users_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_fast_access_docs_to_users" ADD CONSTRAINT "_fast_access_docs_to_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
