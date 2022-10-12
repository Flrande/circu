-- CreateTable
CREATE TABLE "user_access_log" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_access_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_access_log" ADD CONSTRAINT "user_access_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
