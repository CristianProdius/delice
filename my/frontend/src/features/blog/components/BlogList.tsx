import Link from 'next/link';
import { Post } from '@/types/strapi';
import { STRAPI_URL } from '@/lib/strapi/client';

interface BlogListProps {
  posts: Post[];
  locale?: string;
}

export function BlogList({ posts, locale = 'en' }: BlogListProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blog posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/${locale}/blog/${post.slug}`}
          className="group bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-lg"
        >
          {/* Cover Image */}
          {post.coverImage?.media && (
            <div className="aspect-video relative overflow-hidden bg-muted">
              {(() => {
                const media = Array.isArray(post.coverImage.media)
                  ? post.coverImage.media[0]
                  : post.coverImage.media;

                if (!media) return null;

                return (
                  <img
                    src={`${STRAPI_URL}${media.url}`}
                    alt={post.coverImage.alt || post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                );
              })()}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {/* Category Badge */}
            {post.category && (
              <div className="mb-3">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                  {post.category}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{post.author}</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>

            {/* Featured Badge */}
            {post.featured && (
              <div className="mt-3">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-accent text-accent-foreground rounded">
                  Featured
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
