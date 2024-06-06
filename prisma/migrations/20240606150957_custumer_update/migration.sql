/*
  Warnings:

  - Added the required column `surname` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "surname" TEXT NOT NULL;
