//@ts-check

// @ts-ignore
window.smd = {
  regexMarkup: /<(a?:[A-Za-z0-9-_]{2,64}:)(\d{17,20})>|<([@#]\d+)>|<(@[!&]?\d+)>|(```(\w*)([\n\w\W]+?)?)```|(\*{1,3}.+?\*{1,3})|(_{1,3}.+?_{1,3})|(``.+?``)|(`.+?`)|(~~.+~~)|(\|\|.+?\|\|)|(https?:\/\/(-\.)?(?:[^\s\/?\.#-]+\.?)+(?:\/[^\s]*)?)|(\n)/i,
  markup(msg, ele = document.createElement('div'), mentions = {}) {
    const md = msg.split(this.regexMarkup).filter(v => v !== undefined)
    let i

    while ((i = md.shift()) !== undefined) {
      ele.appendChild(document.createTextNode(i))

      // There's some markup to do
      // Starts with:
      // - 'h' -> url
      // - '`' -> inline code
      //    - '`' -> inline code
      //      - '`' -> code block
      // - '_' -> italics
      //    - '_' -> underline
      // - '*' -> Italics
      //    - '*' -> Bold
      //       - '*' -> Bold italics
      // - '~' -> Strikethrough
      // - '|' -> Spoiler
      // - '\n' -> newline
      if (md.length > 0) {
        let cur = md.shift()

        if (cur.substring(0, 3) === '```') {
          // ['text', '```js\ncode\n```', 'js', '\ncode\n', 'text']
          let mdLang = md.shift()
          let innerText = md.shift().trim()
          let pre = document.createElement('pre')
          let code = this.createElement('code', {innerText, className: mdLang ? `lang-${mdLang}` : ''})

          pre.appendChild(code)
          ele.appendChild(pre)
          continue
        }

        switch (cur.charAt(0)) {
          case 'a':
          case ':':
            this.addEmote(ele, cur, md.shift())
          break

          case '#':
            this.addChannel(ele, cur)
          break

          case '@':
            let s = cur.charAt(1)

            if (s === '!' || !isNaN(parseInt(s))) {
              this.addUser(ele, cur)
            } else if (s === '&') {
              this.addRole(ele, cur)
            } else {
              // lol idk
              ele.appendChild(document.createTextNode(cur))
            }
          break

          case '*':
            if (cur.charAt(1) === '*') {
              this.addTagAndStrip(ele, cur, 'b', 2)
            } else {
              this.addTagAndStrip(ele, cur, 'em', 1)
            }
            break

          case 'h':
            this.addLink(ele, cur)
            break

          case '`':
            this.addTagAndStrip(ele, cur, 'code', (
              cur.charAt(1) === '`' && cur.charAt(cur.length - 2)
              ? 2 : 1
              ))
            break

          case '_':
            if (cur.charAt(1) === '_') {
              this.addTagAndStrip(ele, cur, 'u', 2)
            } else {
              this.addTagAndStrip(ele, cur, 'em', 1)
            }
            break

          case '~':
            this.addTagAndStrip(ele, cur, 's', 2)
            break

          case '|':
            this.addSpoiler(ele, cur)
            break

          case '\n':
            ele.appendChild(document.createElement('br'))
            break

          default:
            ele.appendChild(document.createTextNode(cur))
        }
      }
    }

    return ele
  },

  addEmote(ele, name, id) {
    ele.appendChild(createElement('img', {
      src: `https://cdn.discordapp.com/emojis/${id}.${name.startsWith('a') ? 'gif' : 'png'}?v=1`,
      className: 'emoji',
      alt: name,
      draggable: false,
    }))
  },

  addChannel(ele, id) {
    ele.appendChild(createElement('span', {
      className: 'channel',
      innerText: '#' + mentions.channels[id.substring(1)],
    }))
  },

  addUser(ele, id) {
    ele.appendChild(createElement('span', {
      className: 'mention',
      innerText: '@' + (mentions.users[id.substring((id.charAt(1) === '!' ? 2 : 1))] || id),
    }))
  },

  addRole(ele, id) {
    ele.appendChild(createElement('span', {
      className: 'role',
      innerText: '@' + (mentions.roles[id.substring(2)] || id),
    }))
  },

  addTagAndStrip(ele, cur, tag, strip) {
    const text = cur.substring(strip, cur.length - strip)
    const toAdd = (tag !== 'code'
        ? this.markup(text, document.createElement(tag))
        : this.createElement(tag, {innerText: text}))

    ele.appendChild(toAdd)
  },

  addLink(ele, url) {
    ele.appendChild(this.createElement('a', {
      innerText: url,
      href: url,
    }))
  },

  addSpoiler(ele, cur) {
    const e = this.createElement('span', {innerText: cur.substring(2, cur.length - 2), className: 'spoilerText hidden'})
    e.addEventListener('click', e => e.target.classList.remove('hidden'))
    ele.appendChild(e)
  },

  createElement(type, attr = {}) {
    const e = document.createElement(type)

    for (let i of Object.keys(attr))
      e[i] = attr[i]

    return e
  },
}
