import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { AppModule } from './app.module.js'
import { default as hbs } from 'hbs'
import { HELPERS, registerHelpers } from './utils/handlebars.js'
import { Logger, ValidationPipe } from '@nestjs/common'
import env from 'env-var'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function dir(...directories: string[]): string {
  return join(__dirname, '..', ...directories)
}

const PORT = env.get('GIRAFFEDUCK_PORT').required().asString()

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  app.useStaticAssets(dir('public'))
  app.setBaseViewsDir(dir('views'))
  hbs.registerPartials(dir('views', 'partials'))
  registerHelpers(hbs.handlebars, HELPERS)
  app.setViewEngine('hbs')

  await app.listen(PORT)
  const url = await app.getUrl()
  logger.log(`Listening on ${url}`)
}

void bootstrap()
