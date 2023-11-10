const data = {
  layout: 'base.njk',
  title: 'My Rad JavaScript Blog Post',
  description: 'A test description',
}

export default {
  data,
  render(d: typeof data) {
    return `<h1>${d.title}</h1>`
  },
}
