/* eslint-disable prettier/prettier */
import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file_upload.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Express } from 'express';

@ApiTags('File Upload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileuploadservice: FileUploadService) {}

  @Post('uploadImage/:id')
//   @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Subir una imagen' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadImage(
    @Param('id') productId: string,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 2000000, message: 'File is too large' }),
        new FileTypeValidator({ fileType: /(jpg|png|jpeg|webp)$/ })
      ]
    })) file: Express.Multer.File,
  ) {
    return this.fileuploadservice.uploadimage(file, productId);
  }
}









// -----------original
// /* eslint-disable prettier/prettier */

// import { Controller, FileTypeValidator, MaxFileSizeValidator, ParseArrayPipe, ParseFilePipe, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
// import { FileInterceptor, } from '@nestjs/platform-express';
// import { Param } from '@nestjs/common';
// import { FileUploadService } from './file_upload.service';
// import { AuthGuard } from 'src/guards/auth.guard';
// import { ApiTags } from '@nestjs/swagger';

// // nuevo
// import { Multer } from 'multer';
// import { Express } from 'express';



// @ApiTags('File Upload')
// @Controller('files')

// export class FileUploadController {
//     constructor(private readonly fileuploadservice: FileUploadService) { }
//     @Post('uploadImage/:id')
//     @UseGuards(AuthGuard)
//     @UseInterceptors(FileInterceptor('file'))
//     async uploadImage(
//         @Param('id') productId: string,
//         @UploadedFile(new ParseFilePipe({
//             validators: [new MaxFileSizeValidator({ maxSize: 2000000, message: 'File is to Large' }),
//             new FileTypeValidator({ fileType: /(jpg|png|jpeg|webp)$/, })
//             ]
//         }))  file: Express.Multer.File, 
//     ) {
//         return this.fileuploadservice.uploadimage(file, productId)

//     }
// }
