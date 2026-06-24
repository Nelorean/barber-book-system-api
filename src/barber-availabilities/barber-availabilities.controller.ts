import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BarberAvailabilitiesService } from './barber-availabilities.service';
import { CreateBarberAvailabilityDto } from './dto/create-barber-availability.dto';
import { UpdateBarberAvailabilityDto } from './dto/update-barber-availability.dto';

@Controller('barber-availabilities')
export class BarberAvailabilitiesController {
  constructor(private readonly barberAvailabilitiesService: BarberAvailabilitiesService) {}

  @Post()
  create(@Body() createBarberAvailabilityDto: CreateBarberAvailabilityDto) {
    return this.barberAvailabilitiesService.create(createBarberAvailabilityDto);
  }

  @Get()
  findAll() {
    return this.barberAvailabilitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.barberAvailabilitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBarberAvailabilityDto: UpdateBarberAvailabilityDto,
  ) {
    return this.barberAvailabilitiesService.update(id, updateBarberAvailabilityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.barberAvailabilitiesService.remove(id);
  }
}
