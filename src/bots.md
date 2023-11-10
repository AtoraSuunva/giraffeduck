---
layout: templates/page.njk
title: Bots
subtitle: beep boop
description: Some of my bots
tags:
  - bots
  - projects
---

Some of the bots I've made for Discord, usually for utility or moderation. There's even more I've written for personal things (28k scam sites logged 😔)

{% import "macros/cards.njk" as cards %}

{{ cards.card(
  "RobotOtter!",
  "A public utility and moderation bot, filled with tools I've needed (and made) over the years",
  "https://github.com/AtoraSuunva/smolbot/tree/development",
  "Read More on GitHub",
  "/bots/robototter/avy.png") }}

{{ cards.card(
  "BooruBot",
  "Uses my booru package to search up 15 different boorus directly from within Discord",
  "https://github.com/AtoraSuunva/BooruBot",
  "View on GitHub",
  "/bots/boorubot/avy.png") }}

{{ cards.card(
  "BulbaTrivia",
  "Mostly utility and moderation tools for Discord, with some 'fun' commands thrown in too.",
  "/bots",
  "View bots",
  "b!") }}
