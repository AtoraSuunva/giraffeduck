---
layout: templates/page.njk
title: Code
subtitle: 1000101
description: Some of my projects
tags:
  - code
  - projects
---

This list is non-exhaustive, and likely always will be. Most of my public code is on [GitHub](https://github.com/AtoraSuunva), but here's some highlights:

{% import "macros/cards.njk" as cards %}

{{ cards.card(
  "This site!",
  "I wrote all of this from scratch myself",
  "/",
  "You're already on it!",
  "/giraffeduck.png") }}

{{ cards.card(
  "Booru",
  "booru is a Node.js package to easily interface with the APIs of several boorus",
  "https://github.com/AtoraSuunva/booru",
  "View on GitHub",
  "boo") }}

{{ cards.card(
  "Bots",
  "Mostly utility and moderation tools for Discord, with some 'fun' commands thrown in too.",
  "/bots",
  "View bots",
  "b!") }}
