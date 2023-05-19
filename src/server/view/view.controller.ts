import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

import { ViewService } from './view.service';

@Controller()
export class ViewController {
  constructor(private viewService: ViewService) {}

  @Get()
  public async showIndex(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @Get('_next*')
  public async assets(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }

  @Get('*/*')
  public async public(@Req() req: Request, @Res() res: Response) {
    await this.viewService.handler(req, res);
  }
}
