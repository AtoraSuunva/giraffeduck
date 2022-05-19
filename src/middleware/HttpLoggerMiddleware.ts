import { Injectable, NestMiddleware, Logger } from '@nestjs/common'

import { Request, Response, NextFunction } from 'express'

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP')

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl: url } = request
    const userAgent = request.get('user-agent') || ''
    const realIp = request.get('x-forwarded-for') || ip

    response.on('close', () => {
      const { statusCode } = response
      const contentLength = response.get('content-length')

      this.logger.log(
        `${method} ${url} ${statusCode} (${contentLength}) - ${userAgent} (${realIp})`,
      )
    })

    next()
  }
}
