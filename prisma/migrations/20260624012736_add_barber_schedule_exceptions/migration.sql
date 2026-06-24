-- CreateEnum
CREATE TYPE "BarberScheduleExceptionType" AS ENUM ('UNAVAILABLE', 'EXTRA_AVAILABLE');

-- CreateTable
CREATE TABLE "BarberScheduleException" (
    "id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "type" "BarberScheduleExceptionType" NOT NULL DEFAULT 'UNAVAILABLE',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,

    CONSTRAINT "BarberScheduleException_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BarberScheduleException_barber_id_idx" ON "BarberScheduleException"("barber_id");

-- CreateIndex
CREATE INDEX "BarberScheduleException_barber_id_starts_at_idx" ON "BarberScheduleException"("barber_id", "starts_at");

-- AddForeignKey
ALTER TABLE "BarberScheduleException" ADD CONSTRAINT "BarberScheduleException_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
