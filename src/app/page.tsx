"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { connectWebSocket } from '../utils/websocket';

interface Post {
  id: string;
  title: string;
  url: string;
  upvotes: number;
  author: string;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:8080/start-cron', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        setPosts(data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setError(true);
        setLoading(false);
      }
    };

    fetchPosts();

    const socket = connectWebSocket((message) => {
      if (message.type === 'NEW_POSTS') {
        setPosts(message.data);
      }
    });

    return () => {
      socket.close();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-red-500">Failed to load posts.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl text-center font-extrabold mb-6 mt-5 md:text-3xl">Top funny posts you definitely shall check out 💯</h1>
      <p className="mb-12">Fetched from <a className="text-indigo-600 hover:text-indigo-500" href="https://reddit.com/r/funny">r/funny</a></p>
        {posts.map((post: Post) => (
          <a key={post.id} href={post.url} className="p-6 border rounded-lg shadow hover:shadow-lg transition duration-200 flex flex-col items-center h-[50%] w-[90%] mb-6 md:h-[50%] md:w-[50%]">
            <h2 className="text-xl font-semibold text-center">{post.title}</h2>
            <p className='font-extrabold mb-4'>by : <span className='text-[#FF4500]'>{post.author}</span></p>
            <img src={post.url} className="border rounded" alt={post.title} />
            <p className='font-semibold mt-4'>Upvoted by : <span className='font-extrabold text-[#FF4500]'>{post.upvotes}</span> people</p>
          </a>
        ))}
    </div>
  );
}