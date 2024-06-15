/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule, } from '@nestjs/typeorm';
import { CategoriesRepository } from './categories.repository';
import { Categories } from 'src/Entities/Categories.entity';
@Module({

  imports: [TypeOrmModule.forFeature([Categories])],
  controllers: [CategoriesController],

  providers: [CategoriesService, CategoriesRepository]
})
export class CategoriesModule { }
