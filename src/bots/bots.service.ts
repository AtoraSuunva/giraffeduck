import { Injectable } from '@nestjs/common'
import { Bot } from './interfaces/bot'

const BOTS: Bot[] = [
  {
    name: 'RobotOtter',
    description: 'Another general-purpose bot, with a focus on mod commands',
    invite:
      'https://discord.com/api/oauth2/authorize?client_id=189078347207278593&permissions=0&scope=bot%20applications.commands',
  },
  {
    name: 'BooruBot',
    description: 'Search boorus on Discord!',
    invite:
      'https://discord.com/api/oauth2/authorize?client_id=204721731162734592&permissions=0&scope=bot%20applications.commands',
  },
  {
    name: 'BulbaTrivia',
    description: 'Get trivia and pokemon data from Bulbapedia and PokeAPI',
    invite:
      'https://discord.com/api/oauth2/authorize?client_id=200723686205030400&permissions=0&scope=bot%20applications.commands',
  },
  {
    name: 'SmolBot',
    description: 'Private testing bot',
    invite:
      'https://discord.com/api/oauth2/authorize?client_id=205164211423150081&permissions=0&scope=bot%20applications.commands',
  },
]

@Injectable()
export class BotsService {
  find(name: string): Bot | null {
    const lname = name.toLowerCase()
    return BOTS.find((bot) => bot.name.toLowerCase() === lname) || null
  }
}
