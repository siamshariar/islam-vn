import { Metadata } from 'next';
import { getBlogDetail } from '@/lib/api';
import Link from 'next/link';
import { ChevronLeft, User, Calendar, Newspaper, Clock } from "lucide-react"

// Helper to define props interface
interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// 1. DYNAMIC SEO METADATA (Runs on Server)
// Next.js automatically dedupes the fetch request below.
// It won't call the API twice (once for metadata, once for body).
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const id = searchParams.id as string;

  if (!id) return { title: 'Blog Not Found' };

  try {
    // Fetch data for SEO tags
    const post = await getBlogDetail(id);

    return {
      title: post.title,
      description: post.content.substring(0, 160), // SEO snippet
      openGraph: {
        title: post.title,
        type: 'article',
        authors: [post.author],
      },
    };
  } catch (error) {
    return { title: 'Blog Not Found' };
  }
}

// 2. THE PAGE CONTENT
export default async function BlogDetailPage({ searchParams }: PageProps) {
  const id = searchParams.id as string;

  if (!id) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  try {
    // --- THE "MILLIONS OF PAGES" MAGIC ---
    // We fetch data using standard fetch (or our wrapper).
    // Next.js caches this Data Request.

    // In a real Strapi scenario, you would do:
    // const res = await fetch(`https://api.yoursite.com/blogs/${id}`, { next: { revalidate: 3600 } })
    // const post = await res.json()

    // For our mock, we assume getBlogDetail handles the fetch internally.
    const post = await getBlogDetail(id);

    return (
      <div className="px-4 lg:px-8 py-8">
        {/* Back button */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-emerald transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Blogs
        </Link>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12">
          {/* Left Column: Blog Cover/Thumbnail */}
          <div className="sticky top-8">
            <div className="bg-gradient-to-br from-emerald to-emerald-light p-8 rounded-2xl shadow-lg relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

              <div className="relative z-10">
                <Newspaper className="w-16 h-16 text-white/60 mb-6" />
                <h3 className="text-white font-bold text-2xl leading-tight mb-4">{post.title}</h3>
                <p className="text-white/90 text-lg mb-4">{post.author}</p>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Content and Metadata */}
          <div className="space-y-8">
            {/* Title */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-emerald mb-3 font-serif">{post.title}</h1>
              <p className="text-xl text-muted-foreground">{post.author}</p>
            </div>

            {/* Metadata */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <User className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Author</p>
                  <p className="font-semibold">{post.author}</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Published Date</p>
                  <p className="font-semibold">{new Date(post.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3 text-foreground">
                <Newspaper className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-semibold">Islamic Insights</p>
                </div>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center gap-3 text-foreground">
                <Clock className="w-5 h-5 text-emerald" />
                <div>
                  <p className="text-sm text-muted-foreground">Reading Time</p>
                  <p className="font-semibold">5 min read</p>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="bg-card border border-border/50 rounded-2xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-emerald mb-6">Article Content</h2>
              <article className="prose prose-lg max-w-none prose-emerald">
                <div className="whitespace-pre-line leading-relaxed text-foreground">
                  {post.content}
                </div>
              </article>
            </div>

            {/* Article Footer */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Published on {new Date(post.publishedAt).toLocaleDateString()}
                </div>

                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors"
                >
                  Read More Blogs
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>

            {/* Proof of "Infinite Pages": Link to a random ID that doesn't exist in the list */}
            <div className="bg-card border border-border/50 rounded-2xl p-6">
              <h3 className="font-bold mb-2 text-emerald">🚀 Performance Demo</h3>
              <p className="text-sm mb-3 text-muted-foreground">This link goes to a blog ID that we never pre-built. Next.js handles millions of pages efficiently!</p>
              <Link
                href={`/blog-detail?id=random-${Math.floor(Math.random() * 1000)}`}
                className="text-emerald hover:text-emerald/80 font-medium transition-colors"
              >
                Visit Random Blog ID #{Math.floor(Math.random() * 1000)} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="px-4 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-emerald hover:text-emerald/80 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }
}