export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Product Detail Page</h1>
        <p className="text-muted-foreground">
          Product details for <strong>{slug}</strong> will be fetched from Strapi CMS
        </p>
      </div>
    </main>
  );
}
