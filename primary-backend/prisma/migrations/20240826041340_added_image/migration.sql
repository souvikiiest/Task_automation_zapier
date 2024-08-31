/*
  Warnings:

  - Added the required column `image` to the `AvialableActions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `AvialableTrigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvialableActions" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvialableTrigger" ADD COLUMN     "image" TEXT NOT NULL;
