/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file_upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { products } from 'src/Entities/Products.entity';
import { Repository } from 'typeorm';



@Injectable()
export class FileUploadService {
    constructor(private readonly fileuploadrep: FileUploadRepository,
        @InjectRepository(products) private readonly productsRepository: Repository<products>
    ) { }

    async uploadimage(file: Express.Multer.File, productId: string) {
        const searchProduct = await this.productsRepository.findOneBy({ id: productId })

        if (!searchProduct) {
            throw new NotFoundException('Product not Found')
        }
        const uploadedimage = await this.fileuploadrep.UploadImage(file)

        await this.productsRepository.update(searchProduct.id, { imgUrl: uploadedimage.secure_url })

        const updatedProduct = await this.productsRepository.findOneBy({ id: productId })
        return updatedProduct
    }


}
