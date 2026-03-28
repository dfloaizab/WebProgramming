import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Controller('movies')  // Prefijo: /movies
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  // GET /movies
  @Get()
  findAll() {
    return this.moviesService.findAll();
  }

  // GET /movies/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  // POST /movies
  @Post()
  create(@Body() dto: CreateMovieDto) {
    return this.moviesService.create(dto);
  }

  // PUT /movies/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateMovieDto>) {
    return this.moviesService.update(id, dto);
  }

  // DELETE /movies/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
