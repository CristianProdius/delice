import { getPost } from '@/lib/strapi/api';
import { STRAPI_URL } from '@/lib/strapi/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  try {
    const post = await getPost(slug, locale);

    if (!post) {
      notFound();
    }

    return (
      <main className="min-h-screen">
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <header className="mb-8">
                {/* Category Badge */}
                {post.category && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                      {post.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="font-medium">{post.author}</span>
                  <span>•</span>
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground mt-6">
                    {post.excerpt}
                  </p>
                )}
              </header>

              {/* Cover Image */}
              {post.coverImage?.media && (
                <div className="mb-12 rounded-lg overflow-hidden relative w-full aspect-video">
                  {(() => {
                    const media = Array.isArray(post.coverImage.media)
                      ? post.coverImage.media[0]
                      : post.coverImage.media;

                    if (!media) return null;

                    return (
                      <Image
                        src={`${STRAPI_URL}${media.url}`}
                        alt={post.coverImage.alt || post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      />
                    );
                  })()}
                </div>
              )}

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                {post.content && Array.isArray(post.content) && post.content.map((block: any, index: number) => {
                  // Paragraph
                  if (block.type === 'paragraph') {
                    return (
                      <p key={index} className="mb-4">
                        {block.children.map((child: any, i: number) => {
                          let text = child.text;

                          // Apply text formatting
                          if (child.bold) {
                            text = <strong key={i}>{text}</strong>;
                          }
                          if (child.italic) {
                            text = <em key={i}>{text}</em>;
                          }
                          if (child.underline) {
                            text = <u key={i}>{text}</u>;
                          }
                          if (child.strikethrough) {
                            text = <s key={i}>{text}</s>;
                          }
                          if (child.code) {
                            text = <code key={i} className="bg-muted px-1 py-0.5 rounded">{text}</code>;
                          }

                          return text;
                        })}
                      </p>
                    );
                  }

                  // Headings
                  if (block.type === 'heading') {
                    const HeadingTag = `h${block.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
                    const text = block.children.map((child: any) => child.text).join('');

                    return (
                      <HeadingTag key={index} className={`font-bold mb-4 mt-8 ${
                        block.level === 2 ? 'text-3xl' :
                        block.level === 3 ? 'text-2xl' :
                        block.level === 4 ? 'text-xl' :
                        'text-lg'
                      }`}>
                        {text}
                      </HeadingTag>
                    );
                  }

                  // Lists
                  if (block.type === 'list') {
                    const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                    return (
                      <ListTag key={index} className="mb-4 ml-6 list-disc space-y-2">
                        {block.children.map((item: any, i: number) => (
                          <li key={i}>
                            {item.children.map((child: any) => child.text).join('')}
                          </li>
                        ))}
                      </ListTag>
                    );
                  }

                  // Quote
                  if (block.type === 'quote') {
                    return (
                      <blockquote key={index} className="border-l-4 border-primary pl-4 italic my-6">
                        {block.children.map((child: any) => child.text).join('')}
                      </blockquote>
                    );
                  }

                  // Code block
                  if (block.type === 'code') {
                    return (
                      <pre key={index} className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
                        <code>{block.children.map((child: any) => child.text).join('')}</code>
                      </pre>
                    );
                  }

                  return null;
                })}
              </div>

              {/* Tags */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 text-sm bg-muted text-foreground rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>
      </main>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Error Loading Blog Post</h1>
          <p className="text-muted-foreground">
            Could not find blog post with slug: <strong>{slug}</strong>
          </p>
        </div>
      </main>
    );
  }
}
