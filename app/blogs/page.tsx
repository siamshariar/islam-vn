import Link from 'next/link';
import { CardWrapper } from "@/components/ui/card-wrapper"
import { getBlogList } from '@/lib/api';
import { Newspaper, User, Calendar } from "lucide-react"

export default async function BlogListPage() {
  const posts = await getBlogList();

  return (
    <div className="px-4 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald mb-2">Blogs</h1>
        <p className="text-muted-foreground">Read our latest blog posts and insights</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {posts.map((post, index) => (
          <CardWrapper key={post.id} delay={index * 0.05}>
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-emerald/10 rounded-lg">
                  <Newspaper className="w-5 h-5 text-emerald" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{post.content}</p>
                  <Link
                    href={`/blog-detail?id=${post.id}`}
                    className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 font-medium transition-colors text-sm"
                  >
                    Read Full Article →
                  </Link>
                </div>
              </div>
            </div>
          </CardWrapper>
        ))}
      </div>
    </div>
  );
}