import { useState, useEffect, useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegShareSquare,
} from "react-icons/fa";

//api
const BASE_URL = "https://jsonplaceholder.typicode.com/posts?_page=";
const PRY_URL = "https://jsonplaceholder.typicode.com/users";

export default function Posts() {
  type Post = {
    id: number;
    title: string;
    body: string;
    userId: number;
    likes: number;
    liked: boolean;
  };

  type Error = {
    message: string;
  };
  type Page = number;

  type User = {
    id: number;
    name: string;
    username: string;
  };
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState<Page>(1);
  const [hasMore, setHasMore] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const [response, response_1] = await Promise.all([
        fetch(`${BASE_URL}${page}`),
        fetch(`${PRY_URL}`),
      ]);
      if (!response.ok && !response_1.ok) {
        throw new Error("Failed to fetch posts");
      }

      const posts = await response.json();
      const users = await response_1.json();
      setPosts((prev) => [...prev, ...posts]);
      setUsers(users);

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
  const handleLikeClick = (post: Post) => {
    setPosts(
      posts.map((p) =>
        p.id === post.id
          ? { ...p, likes: (p.likes || 1) + 0, liked: !p.liked }
          : p,
      ),
    );
  };

  return (
    <div ref={scrollContainerRef} className="postContainer">
      <h2 className="text-[32px]">Post Feed</h2>
      {posts.map((post: Post) => {
        const user = users.find((user) => user.id === post.id);

        return (
          <div key={post.id} className="postWrapper">
            <div className=" flex justify-between items-center pb-2">
              <h2 className="font-bold flex flex-col">
                {user?.name}
                <span className="text-gray font-thin	"> @{user?.username}</span>
              </h2>
              <HiDotsHorizontal />
            </div>
            <h2 className="postTitle">{post.title}</h2>
            <p className="text-1xl">{post.body}</p>
            <div className="flex justify-between items-center pt-6">
              <button
                className="flex items-center"
                onClick={() => handleLikeClick(post)}
              >
                {post.liked ? <FaHeart /> : <FaRegHeart />}
                {post.liked && post.likes && (
                  <p className=" text-grey pl-2">{post.likes}</p>
                )}
              </button>

              <button>
                <FaRegComment />
              </button>
              <button>
                <FaRegShareSquare />
              </button>
            </div>
          </div>
        );
      })}
      {hasMore && (
        <div className="p-4">
          <p className="text-[1rem]">Loading..</p>
        </div>
      )}
    </div>
  );
}
