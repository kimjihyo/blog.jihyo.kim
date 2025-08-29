export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { default: Post } = await import(`@/../content/slides/${slug}.mdx`);

  return (
    <div className="flex h-screen snap-y snap-mandatory flex-col items-center overflow-y-scroll">
      <article className="my-10 prose max-w-5xl dark:prose-invert prose-h1:text-5xl prose-a:font-normal prose-a:text-primary prose-a:underline-offset-4 prose-code:text-2xl prose-code:font-medium prose-li:text-3xl [&>*]:flex [&>*]:min-h-screen [&>*]:snap-start [&>*]:flex-col [&>*]:justify-center">
        <Post />
      </article>
    </div>
  );
}
