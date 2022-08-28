-- CreateEnum
CREATE TYPE "SurvivalStatus" AS ENUM ('ALIVE', 'DELETED', 'COMPLETELY_DELETED');

-- AlterTable
ALTER TABLE "folder" ADD COLUMN     "survivalStatus" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';

-- AlterTable
ALTER TABLE "general_doc" ADD COLUMN     "survivalStatus" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "survivalStatus" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';

-- AlterTable
ALTER TABLE "wiki_doc" ADD COLUMN     "survivalStatus" "SurvivalStatus" NOT NULL DEFAULT 'ALIVE';
