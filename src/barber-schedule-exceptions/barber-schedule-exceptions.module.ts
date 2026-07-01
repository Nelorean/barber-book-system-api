import { Module } from '@nestjs/common';
import { BarberScheduleExceptionsService } from './barber-schedule-exceptions.service';
import { BarberScheduleExceptionsController } from './barber-schedule-exceptions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule,AuthModule],
  controllers: [BarberScheduleExceptionsController],
  providers: [BarberScheduleExceptionsService],
})
export class BarberScheduleExceptionsModule {}
