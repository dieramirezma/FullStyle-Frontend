import BlogCard from './blog-card'

const data = [
  {
    title: 'Los 15 cortes de pelo corto para mujer que serán tendencia este 2025: modernos y elegantes',
    publishedAt: 'Publicado el 2024-12-27',
    description: 'Sabemos cuáles son los cortes de pelo que arrasarán este 2025. El pixie, el microbob o el mixie son algunos de los looks modernos y elegantes que verás por todas partes este año.',
    image: '/images/blog/blog1.png',
    id: 1
  },
  {
    title: 'Cabello brillante incluso en invierno: los peinados clave para 2025',
    publishedAt: 'Publicado el 2024-12-26',
    description: '¿Quieres presumir de melena este invierno? Te desvelamos cuáles son los peinados clave para 2025, incluyendo tendencias como el wet hair o los looks con trenzas.',
    image: '/images/blog/blog2.png',
    id: 2
  }
]

function BlogSection () {
  return (
    <section className='container mx-auto my-10'>
      <h2 className='subtitle mb-5'>Blog</h2>
      <article className='flex gap-10 lg:flex-row flex-col'>
        {data.map((item, index) => (
          <BlogCard key={index} {...item}/>
        ))}
      </article>
    </section>
  )
}

export default BlogSection
