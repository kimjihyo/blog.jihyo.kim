import type { MDXComponents } from "mdx/types";
import Image, { ImageProps } from "next/image";

const components = {
  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 pl-6 italic">{children}</blockquote>
  ),
  figcaption: ({ children, ...props }) => (
    <figcaption {...props}>{children}</figcaption>
  ),
  pre: ({ children, ...props }) => (
    <pre className="relative overflow-x-auto rounded-lg !px-0" {...props}>
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => {
    const isInline = !props["data-language"];

    if (isInline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 text-primary"
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
      className="my-3 h-auto w-full rounded-md"
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}
