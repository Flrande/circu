-- CreateTable
CREATE TABLE "_favorite_folders_to_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_favorite_docs_to_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_favorite_folders_to_users_AB_unique" ON "_favorite_folders_to_users"("A", "B");

-- CreateIndex
CREATE INDEX "_favorite_folders_to_users_B_index" ON "_favorite_folders_to_users"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_favorite_docs_to_users_AB_unique" ON "_favorite_docs_to_users"("A", "B");

-- CreateIndex
CREATE INDEX "_favorite_docs_to_users_B_index" ON "_favorite_docs_to_users"("B");

-- AddForeignKey
ALTER TABLE "_favorite_folders_to_users" ADD CONSTRAINT "_favorite_folders_to_users_A_fkey" FOREIGN KEY ("A") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorite_folders_to_users" ADD CONSTRAINT "_favorite_folders_to_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorite_docs_to_users" ADD CONSTRAINT "_favorite_docs_to_users_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_favorite_docs_to_users" ADD CONSTRAINT "_favorite_docs_to_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
