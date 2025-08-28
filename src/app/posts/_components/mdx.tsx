interface MdxProps {
  children?: React.ReactNode;
}

export default function Mdx({ children }: MdxProps) {
  return (
    <article className="my-10 prose dark:prose-invert prose-headings:scroll-m-20 prose-a:font-normal prose-a:text-primary prose-a:underline-offset-4 prose-code:text-sm prose-code:font-medium">
      {children}
    </article>
  );
}
