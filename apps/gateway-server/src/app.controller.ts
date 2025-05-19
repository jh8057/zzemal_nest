import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './auth/jwt/jwt-public.decorator';

@Controller()
export class AppController {
  constructor() {}

  // Health Check
  @Public()
  @Get('/health')
  healthCheck(@Res() res: Response) {
    res.status(200).send('OK');
  }
}
