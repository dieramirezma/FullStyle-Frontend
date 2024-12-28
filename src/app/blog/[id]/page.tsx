const data = [
  {
    id: '1',
    title: 'Article 1',
    content: 'Felipe malparidito',
    date: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Article 2',
    content: 'Felipe malparidito 2',
    date: new Date().toISOString()
  }
]

export default async function Page ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const article = data.find(article => article.id === id)

  return (
    <section>
      <h2>{article?.title}</h2>
      <p>{article?.content}</p>
      <small>{article?.date}</small>
    </section>
  )
}
