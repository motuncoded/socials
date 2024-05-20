import { useState, useEffect } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

export default function Home() {
  type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
  };

  type Error = {
    message: string;
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const posts = await response.json();
      setPosts(posts);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loadingContainer">
        <p className="loadingTitle">Loading...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="errorContainer">
        <p className="errorTitle">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="postContainer">
      <h1>Post Feed</h1>
      {posts.map((post: Post) => {
        return (
          <div key={post.id} className="postWrapper">
            <h2 className="postTitle">{post.title}</h2>
            <p className="text-1xl">{post.body}</p>
          </div>
        );
      })}
    </div>
  );
}
