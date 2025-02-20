'use client'

import { motion } from 'framer-motion'
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
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3
      }
    }
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  }

  return (
    <motion.section
      className='container mx-auto my-10'
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      <motion.h2
        className='subtitle mb-5'
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        Blog
      </motion.h2>

      <motion.article
        className='flex gap-10 lg:flex-row flex-col'
        variants={containerVariants}
      >
        {data.map((item, index) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <BlogCard {...item} />
          </motion.div>
        ))}
      </motion.article>
    </motion.section>
  )
}

export default BlogSection
