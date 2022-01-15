import * as hbs from 'hbs'

type Handlebars = typeof hbs.handlebars
interface HandlebarsHelper {
  name: string
  function: Handlebars.HelperDelegate
}

export function registerHelpers(
  handlebars: Handlebars,
  helpers: HandlebarsHelper[],
): void {
  for (const h of helpers) {
    handlebars.registerHelper(h.name, h.function)
  }
}

export const HELPERS: HandlebarsHelper[] = [
  {
    name: 'if_eq',
    function: (a: any, b: any, opts: Handlebars.HelperOptions) => {
      if (a === b) {
        return opts.fn(this)
      }
    },
  },
]
