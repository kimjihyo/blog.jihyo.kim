"use client";

import * as React from "react";

interface PostsLoadingContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const PostsLoadingContext = React.createContext<PostsLoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export function PostsLoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <PostsLoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </PostsLoadingContext.Provider>
  );
}

export function usePostsLoading() {
  return React.useContext(PostsLoadingContext);
}
