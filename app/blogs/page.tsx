import Link from 'next/link';
import { getBlogList } from '@/lib/api';

export default async function BlogListPage() {
  const posts = await getBlogList();

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-8">Latest Textile Insights</h1>
      
      <div className="grid gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded hover:shadow-lg transition">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
            
            {/* CRITICAL: Passing ID as a Query Parameter.
               Next.js handles this navigation client-side (instant).
            */}
            <Link 
              href={`/blog-detail?id=${post.id}`}
              className="text-blue-600 mt-2 inline-block font-medium"
            >
              Read Full Article →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}