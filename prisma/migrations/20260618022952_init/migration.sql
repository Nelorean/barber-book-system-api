-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'BARBER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('SCHEDULED', 'CANCELED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "procedure_description" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'SCHEDULED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarberAvailability" (
    "id" TEXT NOT NULL,
    "barber_id" TEXT NOT NULL,
    "weekday" "Weekday" NOT NULL DEFAULT 'TUESDAY',
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BarberAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Appointment_customer_id_idx" ON "Appointment"("customer_id");

-- CreateIndex
CREATE INDEX "Appointment_barber_id_idx" ON "Appointment"("barber_id");

-- CreateIndex
CREATE INDEX "Appointment_barber_id_starts_at_idx" ON "Appointment"("barber_id", "starts_at");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarberAvailability" ADD CONSTRAINT "BarberAvailability_barber_id_fkey" FOREIGN KEY ("barber_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
