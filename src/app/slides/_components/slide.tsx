interface SlideProps {
  children?: React.ReactNode;
}

export default function Slide({ children }: SlideProps) {
  return <div className="mx-auto flex h-screen w-fit">{children}</div>;
}
