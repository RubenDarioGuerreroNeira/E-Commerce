/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { FileUploadController } from './file_upload.controller';
import { FileUploadService } from './file_upload.service';
import { cloudinaryconfig } from 'src/Config/Cloudinary';
import { FileUploadRepository } from './file_upload.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { products } from 'src/Entities/Products.entity';

@Module({
  imports: [TypeOrmModule.forFeature([products])],
  controllers: [FileUploadController],
  providers: [FileUploadService, cloudinaryconfig, FileUploadRepository],
})
export class FileUploadModule { }