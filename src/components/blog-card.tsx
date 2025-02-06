import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from './ui/button'

export interface BlogCardProps {
  id: number
  title: string
  publishedAt: string
  description: string
  image: string
  content?: Array<{
    type: string
    text: string
  }>
}

function BlogCard ({ id, title, description, publishedAt, image }: BlogCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="relative w-full h-[300px]">
          <Image
            src={image}
            alt={title}
            className="rounded-t-xl object-cover"
            fill
            priority
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{publishedAt}</CardDescription>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Link
          href={`blog/${id}`}
          className={`${buttonVariants({ variant: 'outline' })} w-full`}
        >Leer más</Link>
      </CardFooter>
    </Card>
  )
}

export default BlogCard
