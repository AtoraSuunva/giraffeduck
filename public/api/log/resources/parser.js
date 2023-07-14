const regexId = /(.*?) ?\((\d+)\)$/
const regexMsg =
  /\[(.*?)\] ?(\(\d+\)) (.*?):([\S\s]*?)(?:\| Attach: ([^|]*))?(?:\| RichEmbed: (.*)|$)/
const mentions = {}

document.addEventListener('DOMContentLoaded', main)

async function main() {
  const errorElement = document.getElementById('error')

  if (errorElement) {
    const [channelId, attachmentId] = new URL(document.URL).pathname
      .split('/')
      .pop()
      .split('-')
    const archiveUrl = `https://cdn.discordapp.com/attachments/${channelId}/${attachmentId}/archive.dlog.txt`

    try {
      const archive = await fetch(archiveUrl).then((r) => r.text())
      document.getElementById('archive').innerText = archive
      errorElement.style.display = 'none'
    } catch (e) {
      errorElement.innerText = e
    }
  }

  const pre = document.getElementById('archive')
  const text = pre.innerText.trim()
  const lines = text.split('\n')
  // [Guild (ID); #Channel (ID)]
  // [User#0001 (ID); User#0002 (ID); ...]
  // [users]
  // [channels]
  // [roles]
  //
  // [yyyy-mm-dd HH:mm:ss] (ID) User : message | Attach: | RichEmbed:
  // [yyyy-mm-dd HH:mm:ss] (ID) User : message | Attach: | RichEmbed:
  // [yyyy-mm-dd HH:mm:ss] (ID) User : message | Attach: | RichEmbed:
  // message on another line
  // and again
  // [yyyy-mm-dd HH:mm:ss] (ID) User : message | Attach: | RichEmbed:

  //#region Guild + Channel
  // Guild <small>(1234567890) <span class="channel">#Channel</span> (1234567890)</small>
  const meta = lines.shift()
  const metaElement = document.getElementById('meta')

  const [guild, channel] = meta.substring(1, meta.length - 1).split('; ')
  const [, gName, gId] = guild.match(regexId)
  const [, cName, cId] = channel.match(regexId)

  metaElement.innerText = gName
  const smallMeta = createElement('small', { innerText: ` (${gId}) ` })
  smallMeta.appendChild(
    createElement('span', { innerText: cName, className: 'channel' }),
  )
  smallMeta.appendChild(document.createTextNode(` (${cId})`))

  metaElement.appendChild(smallMeta)
  //#endregion Guild + Channel

  //#region Users
  const usersRaw = lines.shift()
  const userList = document.getElementById('users')
  userList.parentElement.className = 'display'
  // ['blah#0001 (123214)', 'foo#1234 (123213321)']
  const users = usersRaw.substring(1, usersRaw.length - 1).split('; ')

  //<li><span class="mention">@samdask#0001</span> (1145679800)</li>
  for (let u of users) {
    let [, uName, uId] = u.match(regexId)
    let li = document.createElement('li')
    li.appendChild(
      createElement('span', { className: 'mention', innerText: uName }),
    )
    li.appendChild(document.createTextNode(` (${uId})`))
    userList.appendChild(li)
  }
  //#endregion Users

  //#region Mentions
  mentions.users = extractArchiveArray(lines.shift())
  mentions.channels = extractArchiveArray(lines.shift())
  mentions.roles = extractArchiveArray(lines.shift())
  //#endregion Mentions

  // Eat extra line
  lines.shift()

  //#region Messages
  const messagesElement = document.getElementById('messages')
  //<article>
  //    <h4><span class="mention">@Someone#0001</span> <small class="time"> - 09/16 02:36 <span class="msg-id">(123456789)</span></small></h4>
  //    <p>
  //      eat my ass
  //    </p>
  //  </article>

  let lastMessage = ''

  for (let line of lines) {
    let m = parseMessageToObj(line)

    // Only message data
    if (m.time === undefined) {
      lastMessage += '\n' + line
      continue
    }

    // New message
    // If there's another message, dump it
    if (lastMessage) {
      addMessage(parseMessageToObj(lastMessage), messagesElement)
      lastMessage = ''
    }

    lastMessage = line
  }

  if (lastMessage) addMessage(parseMessageToObj(lastMessage), messagesElement)

  //#endregion Messages

  // @ts-ignore
  hljs.initHighlighting()
}

function parseMessageToObj(line) {
  let [, time, id, user, content, attachments, richEmbed] = line.match(
    regexMsg,
  ) || [, , , , line, , , null]

  return { time, id, user, content, attachments, richEmbed }
}

function addMessage(message, messagesElement) {
  const article = document.createElement('article')

  const h4 = document.createElement('h4')
  h4.appendChild(
    createElement('span', { innerText: message.user, className: 'mention' }),
  )

  const tElement = createElement('small', {
    innerText: ' - ' + message.time + ' ',
  })
  tElement.appendChild(
    createElement('span', { innerText: message.id, className: 'msg-id' }),
  )
  h4.appendChild(tElement)

  const messageMarkup = window.smd.markup(
    message.content.trim(),
    document.createElement('p'),
    mentions,
  )

  article.appendChild(h4)
  article.appendChild(messageMarkup)

  if (message.richEmbed) {
    let embedData
    try {
      embedData = JSON.parse(message.richEmbed)
    } catch (e) {}

    if (embedData) {
      const embedClass = new window.RichEmbed(embedData)
      const embedHTML = embedClass.generateHTML()
      article.appendChild(embedHTML)
    }
  }

  if (message.attachments) {
    const attach = message.attachments
      .split(',')
      .map((a) => a.trim())
      .filter((a) => a)

    if (attach.length > 0) {
      const ele = createElement('aside', {
        className: 'attachments',
      })

      for (const a of attach) {
        ele.appendChild(
          createElement('a', {
            href: a,
            innerText: a,
          }),
        )
      }

      article.appendChild(ele)
    }
  }

  messagesElement.appendChild(article)
}

function extractArchiveArray(str) {
  // ['blah#0001 (123214)', 'foo#1234 (123213321)']
  const arr = str.substring(1, str.length - 1).split('; ')
  const map = {}

  if (arr.length === 1 && arr[0] === '') return map

  for (let m of arr) {
    let [, name, id] = m.match(regexId)
    map[id] = name
  }

  return map
}

function createElement(type, attr = {}) {
  const e = document.createElement(type)

  for (let i of Object.keys(attr)) e[i] = attr[i]

  return e
}
