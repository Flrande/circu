-- CreateTable
CREATE TABLE "_users_to_folders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_users_to_docs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_users_to_folders_AB_unique" ON "_users_to_folders"("A", "B");

-- CreateIndex
CREATE INDEX "_users_to_folders_B_index" ON "_users_to_folders"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_users_to_docs_AB_unique" ON "_users_to_docs"("A", "B");

-- CreateIndex
CREATE INDEX "_users_to_docs_B_index" ON "_users_to_docs"("B");

-- AddForeignKey
ALTER TABLE "_users_to_folders" ADD CONSTRAINT "_users_to_folders_A_fkey" FOREIGN KEY ("A") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_to_folders" ADD CONSTRAINT "_users_to_folders_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_to_docs" ADD CONSTRAINT "_users_to_docs_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users_to_docs" ADD CONSTRAINT "_users_to_docs_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
