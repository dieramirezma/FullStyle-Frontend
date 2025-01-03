import Link from 'next/link'

function BlogSection () {
  return (
    <section>
      <h2 className='subtitle'>Blog</h2>
      <div className='flex gap-10'>
        <div>
          <h2>Article 1</h2>
          <p>Felipe malparidito</p>
          <Link href="/blog/1">More Information</Link>
        </div>
        <div>
          <h2>Article 1</h2>
          <p>Felipe malparidito</p>
          <Link href="/blog/2">More Information</Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
