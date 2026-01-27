// lib/api.ts

// Type definition for a Blog Post
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
}

// SIMULATE: Fetching a list of blogs (e.g., from Strapi)
export async function getBlogList(): Promise<BlogPost[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return dummy data
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `post-${i + 1}`,
    title: `Blog Post #${i + 1}: The Future of Textiles`,
    content: "This is a summary of the blog post...",
    author: "John Doe",
    publishedAt: new Date().toISOString(),
  }));
}

// SIMULATE: Fetching a single blog by ID (The "Millions" part)
export async function getBlogDetail(id: string): Promise<BlogPost> {
  console.log(`⚡ FETCHING DATA FROM DB FOR ID: ${id}`); // Log to show when cache is missed
  
  // Simulate network delay (DB query)
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return dummy data specific to the ID
  return {
    id: id,
    title: `Deep Dive into Post ${id}`,
    content: `Here is the full content for post ${id}. This content was generated on the server and cached. In a real app, this would be 2000 words long.`,
    author: "Jane Smith",
    publishedAt: new Date().toISOString(),
  };
}