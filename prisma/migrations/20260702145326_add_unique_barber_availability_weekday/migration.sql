/*
  Warnings:

  - A unique constraint covering the columns `[barber_id,weekday]` on the table `BarberAvailability` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BarberAvailability_barber_id_weekday_key" ON "BarberAvailability"("barber_id", "weekday");
