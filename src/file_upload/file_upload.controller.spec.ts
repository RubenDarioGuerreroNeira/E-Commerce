/* eslint-disable prettier/prettier */

import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor, } from '@nestjs/platform-express';
import { Param } from '@nestjs/common';
import { FileUploadService } from './file_upload.service';

@Controller('files')

export class FileUploadController {
  constructor(private readonly fileuploadservice: FileUploadService) { }
  @Post('uploadImage/:id')
  @UseInterceptors(FilesInterceptor('file'))
  async uploadImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileuploadservice.uploadimage(file, productId)

  }
}
