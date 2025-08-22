interface MdxProps {
  children?: React.ReactNode;
}

export default function Mdx({ children }: MdxProps) {
  return (
    <article className="my-10 prose prose-code:text-sm prose-code:font-medium">
      {children}
    </article>
  );
}
