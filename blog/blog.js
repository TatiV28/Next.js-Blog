import { useRouter } from 'next/router';
import Head from 'next/head';
import { getAllPosts, getPostBySlug } from '../../lib/posts';
import { marked } from 'marked';

export default function BlogPost({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Head>
        <title>{post.title} | Bits-0f-C0de</title>
      </Head>
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="text-gray-600 dark:text-gray-400">
            <time>{new Date(post.date).toLocaleDateString()}</time>
            <span className="mx-2">•</span>
            <span>{post.readTime} min read</span>
          </div>
        </header>
        
        <div 
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const content = marked(post.content);

  return {
    props: {
      post: {
        ...post,
        content,
      },
    },
  };
}
