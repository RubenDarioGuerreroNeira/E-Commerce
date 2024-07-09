/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { products } from "src/Entities/Products.entity"
import { Repository } from "typeorm";
import { Categories } from "src/Entities/Categories.entity";
// import * as data from '../data.json';
// import * as data from 'data.json'
// const data = require('../data.json');

import data from 'data.json';

@Injectable()

export class ProductsRepository {
    constructor(
        @InjectRepository(products)
        private productsRepository: Repository<products>,
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>
    ) { }

    async getProducts(page: number, Limit: number): Promise<products[]> {
        /*modifique*/
        let products = await this.productsRepository.find({ relations: { category_id: true }, });

        const start = (page - 1) * Limit;
        const end = start + + Limit;
        products = products.slice(start, end);
        return products;

    }

    getProductByid(id: string): Promise<products | null> {
        return this.productsRepository.findOneBy({ id: id });
    }

   
    async addProduct() {
        const categories = await this.categoriesRepository.find();

        if (Array.isArray(data)) {
            for (const element of data) {
                const category = categories.find((cat) => cat.name === element.category);
                const product = new products();
                product.name = element.name;
                product.description = element.description;
                product.price = element.price;
                product.imgUrl = element.imgUrl;
                product.stock = element.stock;
                product.category_id = category;

                await this.productsRepository
                    .createQueryBuilder()
                    .insert()
                    .into(products)
                    .values(product)
                    .orUpdate(["description", "price", "imgUrl", "stock"], ["name"])
                    .execute();
            }
            return 'Products Added';
        } else {
            throw new Error('Invalid data format: data is not an array');
        }
    }


    async updateProduct(id: string, product: products) {
        await this.productsRepository.update(id, product)
        const updateProduct = await this.productsRepository.findOneBy({ id })

        return updateProduct
    }


}
