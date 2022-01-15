import { Request } from 'express'

export function getBase(req: Request): string {
  const host = req.get('Host')
  const protocol = req.protocol
  return `${protocol}://${host}`
}
