import { useState, useEffect, useRef } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts?_page=";

export default function Posts() {
  type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
  };

  type Error = {
    message: string;
  };
  type Page = number;

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<Page>(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}${page}`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const posts = await response.json();
      setPosts((prev) => [...prev, ...posts]);
      if (posts.length < 10) {
        setHasMore(false);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setTimeout(() => {
      fetchPosts();
    }, 1000);
  }, [page]);

  const handleScroll = () => {
    console.log("top", document.documentElement.scrollTop);
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (hasMore) {
        setPage((prev) => prev + 1);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });

  //   if (loading) {
  //     return (
  //       <div className="loadingContainer">
  //         <p className="loadingTitle">Loading...</p>
  //       </div>
  //     );
  //   }
  if (error) {
    return (
      <div className="errorContainer">
        <p className="errorTitle">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="postContainer">
      <h1>Post Feed</h1>
      {posts.map((post: Post) => {
        return (
          <div key={post.id} className="postWrapper">
            <h2 className="postTitle">{post.title}</h2>
            <p className="text-1xl">{post.body}</p>
          </div>
        );
      })}
      {hasMore && <p className="text-2xl">Loading..</p>}
    </div>
  );
}
