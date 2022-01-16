import {
  BadRequestException,
  Controller,
  Get,
  Header,
  Query,
  Req,
  Res,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { getBase } from '../../utils/request.js'
import { FoxService } from './fox.service.js'

@Controller('api/fox')
export class FoxController {
  constructor(private foxService: FoxService) {}

  @Get()
  @Header('Cache-Control', 'no-cache')
  getFox(
    @Query('direct') direct: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const base = getBase(req)

    if (direct) {
      const directNum = parseInt(direct, 10)
      if (Number.isNaN(directNum)) {
        throw new BadRequestException('`direct` must be a number')
      }
      console.log('redirect', directNum)
      const fox = this.foxService.getFox(base, directNum)
      return res.redirect(fox.url)
    }

    return res.json(this.foxService.getRandomFox(base))
  }

  @Get('direct')
  getDirectFox(@Req() req: Request, @Res() res: Response): void {
    const base = getBase(req)
    const fox = this.foxService.getRandomFox(base)
    res.redirect(fox.url)
  }
}
