/*
  Warnings:

  - A unique constraint covering the columns `[coId,poId]` on the table `CO_PO_Mapping` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CO_PO_Mapping_coId_poId_key` ON `CO_PO_Mapping`(`coId`, `poId`);
