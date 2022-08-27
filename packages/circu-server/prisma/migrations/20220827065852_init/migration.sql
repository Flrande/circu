-- CreateTable
CREATE TABLE "doc" (
    "id" TEXT NOT NULL,
    "lastModify" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "parentDocId" TEXT,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "doc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DocAdministrators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocCollaborators" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_DocReaders" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DocAdministrators_AB_unique" ON "_DocAdministrators"("A", "B");

-- CreateIndex
CREATE INDEX "_DocAdministrators_B_index" ON "_DocAdministrators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocCollaborators_AB_unique" ON "_DocCollaborators"("A", "B");

-- CreateIndex
CREATE INDEX "_DocCollaborators_B_index" ON "_DocCollaborators"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DocReaders_AB_unique" ON "_DocReaders"("A", "B");

-- CreateIndex
CREATE INDEX "_DocReaders_B_index" ON "_DocReaders"("B");

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_parentDocId_fkey" FOREIGN KEY ("parentDocId") REFERENCES "doc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doc" ADD CONSTRAINT "doc_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocAdministrators" ADD CONSTRAINT "_DocAdministrators_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocAdministrators" ADD CONSTRAINT "_DocAdministrators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocCollaborators" ADD CONSTRAINT "_DocCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocCollaborators" ADD CONSTRAINT "_DocCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocReaders" ADD CONSTRAINT "_DocReaders_A_fkey" FOREIGN KEY ("A") REFERENCES "doc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DocReaders" ADD CONSTRAINT "_DocReaders_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
