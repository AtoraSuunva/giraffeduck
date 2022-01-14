import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'
import { AppModule } from './app.module.js'
import { default as hbs } from 'hbs'
import { HELPERS, registerHelpers } from './handlebars.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

function dir(...directories: string[]): string {
  return join(__dirname, '..', ...directories)
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(dir('public'))
  app.setBaseViewsDir(dir('views'))
  hbs.registerPartials(dir('views', 'partials'))
  registerHelpers(hbs.handlebars, HELPERS)
  app.setViewEngine('hbs')

  await app.listen(3000)
}

void bootstrap()
