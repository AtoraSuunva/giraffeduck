import { Controller, Get, Render } from '@nestjs/common'

@Controller('docs')
export class DocsController {
  @Get('fox')
  @Render('docs/fox')
  getFoxDocs() {
    void 0
  }

  @Get('bee')
  @Render('docs/bee')
  getBeeDocs() {
    void 0
  }
}
