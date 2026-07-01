import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BarberAvailabilitiesModule } from './barber-availabilities/barber-availabilities.module';
import { BarberScheduleExceptionsModule } from './barber-schedule-exceptions/barber-schedule-exceptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HealthModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    BarberAvailabilitiesModule,
    BarberScheduleExceptionsModule,
  ],
})
export class AppModule {}
