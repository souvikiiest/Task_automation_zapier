/*
  Warnings:

  - Added the required column `name` to the `Zap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Zap" ADD COLUMN     "name" TEXT NOT NULL;
