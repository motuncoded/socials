import { useState, useEffect, useRef } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegShareSquare,
} from "react-icons/fa";

//api
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts?_page=";
const USERS_URL = "https://jsonplaceholder.typicode.com/users";


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

export default function Posts() {

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
        fetch(`${POSTS_URL}${page}`),
        fetch(`${USERS_URL}`),
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
  const handleLikeClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    post: Post,
  ) => {
    event.preventDefault();
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? { ...p, likes: p.liked ? 0 : (p.likes || 0) + 1, liked: !p.liked }
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
            <h3 className="postTitle">{post.title}</h3>
            <h4 className="text-1xl">{post.body}</h4>
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                className="flex items-center justify-center"
                onClick={(event) => handleLikeClick(event, post)}
              >
                {post.liked ? <FaHeart size="20" /> : <FaRegHeart size="20" />}
                {post.likes === 0 ? (
                  <span className="hidden">{post.likes}</span>
                ) : (
                  <span className="pl-4">{post.likes}</span>
                )}
              </button>

              <button type="button">
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
