# giraffeduck

The server behind giraffeduck.com

Originally it was also my main website, however I ended up rewriting it to [atora.dev](https://atora.dev) instead (with the goal of running it serverless). The content on Giraffeduck is all old and outdated (and anything worth porting was ported to atora.dev). You can view the ancient version with the [archive tag](https://github.com/AtoraSuunva/giraffeduck/releases/tag/archive).

However, some things can't be CF serverless (the Discord attachment proxy can't, since Discord blocks CF workers from accessing URLs), so giraffeduck must remain for the APIs.

It's possible someday I will find some serverless provider that isn't blocked by Discord and use that instead, but for now this works fine.

Required env vars:

```ini
BIND_TO="127.0.0.1:8080" # IP:Port to bind the server to, optional and defaults to "127.0.0.1:8080"
BOT_TOKEN="token" # Bot token used to refresh discord cdn urls
ATTACHMENTS_TOKEN="random" # Randomly generated string to avoid random people using the server as a media proxy
```
