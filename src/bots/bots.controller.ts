import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Render,
  Res,
  Headers,
} from '@nestjs/common'
import { Response } from 'express'
import { BotsService } from './bots.service.js'

@Controller('bots')
export class BotsController {
  constructor(private botsService: BotsService) {}

  @Get()
  @Render('bots/index')
  getIndex() {
    void 0
  }

  @Get(':name/invite')
  redirectToInvite(@Param('name') name: string, @Res() res: Response) {
    const bot = this.botsService.find(name)

    if (bot) {
      res.redirect(bot.invite)
    } else {
      throw new NotFoundException()
    }
  }

  @Get('smol/help')
  rickRoll(@Headers('user-agent') userAgent: string, @Res() res: Response) {
    const discordAgent = 'Discordbot/2.0'

    if (!userAgent.includes(discordAgent)) {
      return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    }

    return res.render('bots/smol_troll')
  }
}
