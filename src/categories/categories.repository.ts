/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Categories } from "src/Entities/Categories.entity";
import { Repository } from "typeorm";
// import * as data from '../data.json';
// const data = require('../data.json');
// import * as data from 'data.json'
import data from 'data.json';



@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,) { }


    // async addCategories() {
    //     data?.map(async (element) => {
    //         await this.categoriesRepository
    //             .createQueryBuilder()
    //             .insert()
    //             .into(Categories)
    //             .values({ name: element.category })
    //             .orIgnore('("name") DO NOTHING')
    //             .execute()

    //     })
    //     return 'Categories Added';
    // }

    async addCategories() {
        if (Array.isArray(data)) {
            for (const element of data) {
                await this.categoriesRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Categories)
                    .values({ name: element.category })
                    .onConflict('("name") DO NOTHING') // Corregir el método onConflict
                    .execute();
            }
            return 'Categories Added';
        } else {
            throw new Error('Invalid data format: data is not an array');
        }
    }


}