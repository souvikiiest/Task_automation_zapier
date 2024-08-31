/*
  Warnings:

  - Added the required column `active` to the `Zap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `active` to the `ZapRunOutbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Zap" ADD COLUMN     "active" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "ZapRunOutbox" ADD COLUMN     "active" BOOLEAN NOT NULL;
