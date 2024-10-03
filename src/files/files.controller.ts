import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';
import path from 'path';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService:ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    //OJO que es Response de Express
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getstaticProductImage(imageName);
    return res.sendFile(path);
  }


  
  @Post('product')
  @UseInterceptors(FileInterceptor('file' , { 
    fileFilter:fileFilter,
    //limits:{fieldSize: 1000}
    storage: diskStorage({
      destination:'./static/products',
      filename: fileNamer
    })
  }))
    uploadProductImage(
      @UploadedFile() file: Express.Multer.File,
    ){

      if(!file){
        throw new BadRequestException('Make sure that the file is a image')
      }
      const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    
      
      return secureUrl; 
      
    }

}
