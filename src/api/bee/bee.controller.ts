import { Controller, Get, Query } from '@nestjs/common'
import { BeeService } from './bee.service.js'
import { TextQuery } from './validation/TextQuery.js'

@Controller('api/bee')
export class BeeController {
  constructor(private beeService: BeeService) {}

  @Get()
  getMovie(@Query() textQuery: TextQuery): string {
    return this.beeService.getMovieLines(textQuery)
  }
}
