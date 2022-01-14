import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  @Render('index')
  getIndex() {
    return ''
  }

  @Get('code')
  @Render('code')
  getCode() {
    return ''
  }

  @Get('about')
  @Render('about')
  getAbout() {
    return ''
  }

  @Get('contact')
  @Render('contact')
  getContact() {
    return ''
  }
}
