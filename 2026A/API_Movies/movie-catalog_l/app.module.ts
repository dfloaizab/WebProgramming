import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Usa ConfigService para leer el .env de forma segura
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    MoviesModule
  ],
})
export class AppModule {}
