import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");

  const userStore = useSelector((state) => state.user);
  const token = userStore?.token;

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://quleep-backend.onrender.com/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://quleep-backend.onrender.com/api/posts/${id}`, {
        headers: { Authorization: token },
      });
      alert("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error deleting post!");
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setUpdatedTitle(post.title);
    setUpdatedContent(post.content);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://quleep-backend.onrender.com/api/posts/${editingPost._id}`,
        { title: updatedTitle, content: updatedContent },
        { headers: { Authorization: token } }
      );
      alert("Post updated successfully!");
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Error updating post!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post._id} className="bg-white shadow-lg rounded-lg p-4">
            {editingPost && editingPost._id === post._id ? (
              <form onSubmit={handleUpdate}>
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                  placeholder="Title"
                  required
                />
                <textarea
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                  rows="3"
                  placeholder="Content"
                  required
                ></textarea>
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setEditingPost(null)}
                    className="bg-gray-500 text-white px-3 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-3 py-2 rounded-md"
                  >
                    Update
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center mb-4">
                  <img
                    src={post.author?.profilePicture || "default-avatar-url"}
                    alt={`${post.author?.name}'s profile`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="text-gray-800 font-bold">
                    {post.author?.name || "Unknown User"}
                  </span>
                </div>
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-gray-700">{post.content}</p>
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                  >
                    Delete
                  </button>
                  <Link to={`/post/${post._id}`} className="bg-blue-500 text-white px-3 py-2 rounded-md" >
                    View Details</Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
