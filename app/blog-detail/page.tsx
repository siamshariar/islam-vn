import { Metadata } from 'next';
import { getBlogDetail } from '@/lib/api';
import Link from 'next/link';

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
}

// 2. THE PAGE CONTENT
export default async function BlogDetailPage({ searchParams }: PageProps) {
  const id = searchParams.id as string;

  if (!id) {
    return <div className="p-10 text-red-500">Error: No Post ID provided in URL.</div>;
  }

  // --- THE "MILLIONS OF PAGES" MAGIC ---
  // We fetch data using standard fetch (or our wrapper).
  // Next.js caches this Data Request.
  
  // In a real Strapi scenario, you would do:
  // const res = await fetch(`https://api.yoursite.com/blogs/${id}`, { next: { revalidate: 3600 } })
  // const post = await res.json()
  
  // For our mock, we assume getBlogDetail handles the fetch internally.
  const post = await getBlogDetail(id);

  return (
    <div className="max-w-3xl mx-auto p-10">
      <Link href="/blogs" className="text-gray-500 hover:underline mb-4 block">
        ← Back to List
      </Link>

      <article>
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        
        <div className="flex justify-between text-sm text-gray-500 border-b pb-4 mb-6">
          <span>By {post.author}</span>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>

        <div className="prose lg:prose-xl">
          <p>{post.content}</p>
        </div>
      </article>

      {/* Proof of "Infinite Pages": Link to a random ID that doesn't exist in the list */}
      <div className="mt-12 p-6 bg-gray-100 rounded">
        <h3 className="font-bold">Try a random page?</h3>
        <p className="text-sm mb-2">This link goes to an ID that we never pre-built.</p>
        <Link href={`/blog-detail?id=random-${Math.floor(Math.random() * 1000)}`} className="text-blue-600 font-bold">
          Visit Random ID #{Math.floor(Math.random() * 1000)}
        </Link>
      </div>
    </div>
  );
}