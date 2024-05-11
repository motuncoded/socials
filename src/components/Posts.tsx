import React, { useState, useEffect } from 'react'


function Posts() {

  
type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

    //API 
    const BASE_URL = "https://jsonplaceholder.typicode.com/posts";
    //  const URL = "https://jsonplaceholder.typicode.com/users";


    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false)
  // const [users, setUsers] = useState([]);


 

  const fetchPosts = async() => {
    setLoading(true)
    const response = await fetch(BASE_URL);
    const posts = await response.json();
    setPosts(posts)
    setLoading(false)

  }
 

  useEffect(()=>{
    fetchPosts()

  }, [])
 if(loading){
   return (<div className="loadingContainer">
     <p>Loading...</p>
   </div>)
 }

  return (
    <div className='postContainer'>
      <h1>Post Feed</h1>
      {
        posts.map((post:Post) => {
          return (
            <div key={post.id} className='postWrapper'>
              <div className='imageContainer'>
              </div>
              <h2 className='postTitle'>{post.title}</h2>
              <p>{post.body}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default Posts
