import {
  Body,
  Controller,
  Post,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { formatBytes } from 'libs/shared/utils';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { FileService } from './file.service';
import { UploadDto } from './file.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
          callback(null, Date.now() + file.originalname);
        },
      }),
    }),
  )
  uploadFile(
    @Body() body: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      filename: file.filename,
      path: file.path,
      size: formatBytes(file.size),
    };
  }
}
