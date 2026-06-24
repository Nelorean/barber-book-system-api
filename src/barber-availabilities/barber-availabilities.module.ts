import { Module } from '@nestjs/common';
import { BarberAvailabilitiesService } from './barber-availabilities.service';
import { BarberAvailabilitiesController } from './barber-availabilities.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BarberAvailabilitiesController],
  providers: [BarberAvailabilitiesService],
})
export class BarberAvailabilitiesModule {}
