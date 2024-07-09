/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common"
import { ProductsRepository } from "./productsRepository";
import { products } from "src/Entities/Products.entity";
@Injectable()

export class ProdutsService {
    constructor(private productsService: ProductsRepository) { }

    getProducts(page: number, limit: number) {
        return this.productsService.getProducts(page, limit)

    }

    addProducts() {
        return this.productsService.addProduct()
    }


    async getProductById(id: string): Promise<products | null> {
        try {
            const product = await this.productsService.getProductByid(id);
            return product ? product : null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

   
}

