class RichEmbed {
  constructor (_data = {}) {
    this._data = _data
  }

  generateHTML() {
    const root = createElement('div', {className: 'embed embedWrapper', 'aria-hidden': false})
    root.appendChild(createElement('div', {className: 'embedPill', style: this._data.color ? `background-color: #${this._data.color.toString(16)};` : ''}))
    const inner = createElement('div', {className: 'embedInner'})
    const content = createElement('div', {className: 'embedContent'})
    const contentInner = createElement('div', {className: 'embedContentInner markup'})
    const contentInnerElements = []

    if (this._data.author) {
      contentInnerElements.push(this.generateAuthorHTML())
    }

    if (this._data.title) {
      contentInnerElements.push(this.generateTitleHTML())
    }

    if (this._data.description) {
      contentInnerElements.push(this.generateDescriptionHTML())
    }

    if (this._data.fields) {
      contentInnerElements.push(this.generateFieldsHTML())
    }

    for (let e of contentInnerElements)
      contentInner.appendChild(e)

    content.appendChild(contentInner)

    if (this._data.thumbnail) {
      content.appendChild(this.generateThumbnailHTML())
    }

    inner.appendChild(content)

    if (this._data.image) {
      inner.appendChild(this.generateImageHTML())
    }

    if (this._data.footer || this._data.timestamp) {
      inner.appendChild(this.generateFooterHTML())
    }

    root.appendChild(inner)

    return root
  }

  generateAuthorHTML() {
    const author = createElement('div', {
      className: 'embedAuthor'
    })

    if (this._data.author.icon_url) {
      author.appendChild(createElement('img', {
        className: 'embedAuthorIcon',
        src: this._data.author.icon_url
      }))
    }

    if (this._data.author.name) {
      author.appendChild(createElement('a', {
        className: 'anchor embedAuthorNameLink embedLink embedAuthorName',
        href: this._data.author.url || '',
        tabindex: '0',
        rel: 'noreferrer noopener',
        target: '_blank',
        role: 'button',
        innerText: this._data.author.name
      }))
    }

    return author
  }

  generateTitleHTML() {
    const ele = createElement('div', { className: 'embedMargin' })
    ele.appendChild(window.smd.markup(this._data.title, createElement('a', {
      className: 'anchor embedTitleLink embedLink embedTitle',
      href: this._data.url || '',
      tabindex: '0',
      rel: 'noreferrer noopener',
      target: '_blank',
      role: 'button'
    })))
    return ele
  }

  generateDescriptionHTML() {
    const markedUp = window.smd.markup(this._data.description, document.createElement('span'))
    const ele = createElement('div', { className: 'embedDescription embedMargin' })
    ele.appendChild(markedUp)
    return ele
  }

  generateFieldsHTML() {
    const fields = []

    for (let f of this._data.fields) {
      const embedField = createElement('div', {
            className: 'embedField' + (f.inline ? ' embedFieldInline' : '')
          })

      const fieldName = createElement('div', {
        className: 'embedFieldName'
      })

      fieldName.appendChild(
        window.smd.markup(f.name)
      )

      const fieldValue = createElement('div', {
        className: 'embedFieldValue'
      })

      fieldValue.appendChild(
        window.smd.markup(f.value)
      )

      embedField.appendChild(fieldName)
      embedField.appendChild(fieldValue)
      fields.push(embedField)
    }

    const ele = createElement('div', {
      className: 'embedFields embedMargin'
    })

    for (const f of fields) {
      ele.appendChild(f)
    }

    return ele
  }

  generateThumbnailHTML() {
    return createElement('a', {
      className: 'anchor imageWrapper imageZoom embedThumbnail',
      href: this._data.url || '',
      rel: 'noreferrer noopener',
      target: '_blank',
      role: 'button',
      style: 'width: 80px; height: 80px;'
    }, createElement('img', {
      alt: '',
      src: this._data.thumbnail.url,
      style: 'width: 80px; height: 80px;'
    }))
  }

  generateImageHTML() {
    return createElement('a', {
      className: 'anchor imageWrapper imageZoom embedImage embedMarginLarge embedWrapper',
      href: this._data.url || '',
      rel: 'noreferrer noopener',
      target: '_blank',
      role: 'button',
      style: 'width: 256px; height: 256px;'
    }, createElement('img', {
      alt: '',
      src: this._data.image.url,
      style: 'width: 256px; height: 256px;'
    }))
  }

  generateFooterHTML() {
    const footer = createElement('div', {
      className: 'embedFooter embedMarginLarge'
    })

    if (this._data.footer && this._data.footer.icon_url) {
      footer.appendChild(createElement('img', {
        className: 'embedFooterIcon',
        alt: '',
        src: this._data.footer.icon_url
      }))
    }

    if ((this._data.footer && this._data.footer.text) || this._data.timestamp) {
      const footerText = createElement('span', {
        className: 'embedFooterText'
      })

      if (this._data.footer && this._data.footer.text) {
        footerText.appendChild(
          document.createTextNode(this._data.footer.text)
        )
      }

      if ((this._data.footer && this._data.footer.text) && this._data.timestamp) {
        footerText.appendChild(createElement('span', {
          className: 'embedFooterSeparator',
          innerText: '•'
        }))
      }

      if (this._data.timestamp) {
        footerText.appendChild(
          document.createTextNode(this._data.timestamp.toLocaleString())
        )
      }

      footer.appendChild(footerText)
    }

    return footer
  }
}

function createElement(type, attr = {}, ...children) {
  const e = document.createElement(type)
  for (let i of Object.keys(attr))
    e[i] = attr[i]

  for (let c of children) {
    e.appendChild(c)
  }

  return e
}

window.RichEmbed = RichEmbed
