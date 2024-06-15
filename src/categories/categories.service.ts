/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';



@Injectable()
export class CategoriesService {
    constructor(private categoriesRepo: CategoriesRepository) { }

    addCategories() {
        return this.categoriesRepo.addCategories();

    }



}
