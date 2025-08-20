import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components = {
  h1: ({ children, id }) => (
    <h1 id={id} className="mt-10 scroll-m-20 font-bold text-4xl">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="mt-10 scroll-m-20 border-b pb-2 font-semibold text-2xl"
    >
      {children}
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="mt-6 scroll-m-20 border-b text-xl font-semibold tracking-tight"
    >
      {children}
    </h3>
  ),
  h4: ({ children, id }) => (
    <h4
      id={id}
      className="mt-6 scroll-m-20 border-b text-lg font-semibold tracking-tight"
    >
      {children}
    </h4>
  ),
  h5: ({ children, id }) => (
    <h5 id={id} className="mt-6 scroll-m-20 border-b text-lg tracking-tight">
      {children}
    </h5>
  ),
  h6: ({ children, id }) => (
    <h6 id={id} className="mt-6 scroll-m-20 text-base tracking-tight">
      {children}
    </h6>
  ),
  a: ({ children, ...props }) => (
    <a
      className="font-medium underline underline-offset-4 text-blue-400"
      {...props}
    >
      {children}
    </a>
  ),
  p: ({ children }) => <p className="not-first:my-5">{children}</p>,
  ul: ({ children }) => <ul className="my-4 ml-4 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="my-4 ml-4 list-decimal">{children}</ol>,
  li: ({ children }) => <li className="mt-2">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 pl-6 italic">{children}</blockquote>
  ),
  figcaption: ({ children, ...props }) => (
    <figcaption {...props}>{children}</figcaption>
  ),
  pre: ({ children, ...props }) => (
    <pre
      className="relative rounded-lg overflow-x-auto border !bg-transparent !px-0"
      {...props}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => {
    const isInline = !props["data-language"];

    if (isInline) {
      return (
        <code
          className="text-sm rounded bg-muted px-1.5 py-0.5 text-blue-600 dark:text-blue-400"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className="block py-2 font-mono text-sm leading-relaxed md:text-base"
        {...props}
      >
        {children}
      </code>
    );
  },
  img: (props) => (
    <Image
      width={800}
      height={600}
      sizes="100vw"
      className="w-full h-auto my-3 rounded-md"
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
