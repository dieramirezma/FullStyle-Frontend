import { articles } from '@/data/articles'
import { type Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  keywords: ['cortes de pelo', 'tendencias', 'peluquería', 'moda', 'belleza']
}

export default async function Page ({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const article = articles.find(article => article.id.toString() === id)

  if (article === undefined || article === null) {
    return <div>Article not found</div>
  }

  return (
    <main className='flex flex-col gap-20 px-10 my-10 md:px-28'>
      <article>
        <div className='relative w-full h-[700px] mb-8'>
          <Image
            src={article.image}
            alt={article.title}
            className='object-cover'
            fill
          />
        </div>
        <h1 className="title">{article?.title}</h1>
        <small className='block mb-6 mt-2'>{article?.description}</small>
        {article?.content?.map((content, index) => {
          if (content.type === 'heading') {
            return <h2 className='subtitle-blog mt-4' key={index}>{content.text}</h2>
          } else {
            return <p key={index}>{content.text}</p>
          }
        })
      }
      </article>
    </main>
  )
}
