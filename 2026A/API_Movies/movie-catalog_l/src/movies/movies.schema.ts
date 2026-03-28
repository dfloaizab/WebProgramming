import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  director_id: number;

  @Prop({ required: true })
  genre: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
