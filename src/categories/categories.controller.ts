/* eslint-disable prettier/prettier */
import { Get, Controller, OnApplicationBootstrap } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController implements OnApplicationBootstrap {
    // constructor(private categoriesService: CategoriesService) { }

    // automatizo la CARGA DE CATEGORIAS 
    constructor(private c: CategoriesService) { }
    onApplicationBootstrap() {
        this.addCategories();
    }

    @Get('seeder')
    addCategories() {
        return this.c.addCategories()

    }


}
