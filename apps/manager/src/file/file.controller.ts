import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as uuid from 'uuid';
import * as path from 'path';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileService } from './file.service';

// todo 鉴权
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@ApiTags('file')
@Controller()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('manager/file/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, uuid.v4() + path.extname(file.originalname));
        },
      }),
    }),
  )
  async uploadFile(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return this.fileService.handleUploadType(body, file);
  }
}
