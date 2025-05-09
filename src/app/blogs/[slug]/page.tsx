import { getBlogData, getAllBlogIds } from "@/lib/blogs"
import Image from "next/image"


// Generate static params for all blog posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const blogIds = await getAllBlogIds()
  return blogIds.map((id) => ({ slug: id }))
}




export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>
  }
) {
  // Resolve the params promise
  const { slug } = await props.params
  
  // Fetch the blog data using the slug
  const blog = await getBlogData(slug)

  return {
    title: `${blog.title} | Y2Map Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage || "/opengraph-image.png"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage || "/opengraph-image.png"],
    },
  }
}



export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlogData(slug)

  return (
    <div className="flex justify-center items-center min-h-screen py-10 px-4">
      <div className="flex flex-col items-center max-w-screen-xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">{blog.title}</h1>

        <Image
          src={blog.coverImage || "/placeholder.svg"}
          alt={blog.title}
          width={800}
          height={450}
          className="w-full max-w-screen-xl h-auto object-contain rounded-lg mb-6"
        />
        <div dangerouslySetInnerHTML={{ __html: blog.content }} className="prose max-w-none" />
      </div>
    </div>
  )
}

