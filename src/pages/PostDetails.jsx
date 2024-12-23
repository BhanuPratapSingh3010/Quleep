import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        const response = await axios.get(`https://quleep-backend.onrender.com/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPostById();
  }, [id]);

  if (loading) return <p>Loading post details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center mb-4">
        <img
          src={post.author.profilePicture}
          alt={`${post.author.name}'s profile`}
          className="w-12 h-12 rounded-full mr-3"
        />
        <p className="text-lg font-medium">{post.author.name}</p>
      </div>
      <p className="text-gray-700">{post.content}</p>
    </div>
  );
};

export default PostDetails;
