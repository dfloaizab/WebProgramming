import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './movies.schema';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
  ) {}

  // Obtener todas las películas
  async findAll(): Promise<Movie[]> {
    return this.movieModel.find().exec();
  }

  // Obtener una película por ID
  async findOne(id: string): Promise<Movie> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) throw new NotFoundException(`Movie #${id} not found`);
    return movie;
  }

  // Crear una película
  async create(dto: CreateMovieDto): Promise<Movie> {
    const newMovie = new this.movieModel(dto);
    return newMovie.save();
  }

  // Actualizar una película
  async update(id: string, dto: Partial<CreateMovieDto>): Promise<Movie> {
    const updated = await this.movieModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException(`Movie #${id} not found`);
    return updated;
  }

  // Eliminar una película
  async remove(id: string): Promise<Movie> {
    const deleted = await this.movieModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`Movie #${id} not found`);
    return deleted;
  }
}
