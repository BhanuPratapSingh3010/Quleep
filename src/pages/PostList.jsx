import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedContent, setUpdatedContent] = useState("");
  const [updatedFiles, setUpdatedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formDetails, setFormDetails] = useState({
    title: "",
    description: "",
    file: [],
  });

  const userStore = useSelector((state) => state.user);
  const token = userStore?.token;

  const handleFileChange = (e) => {
    const files = e.target.files;
    const filesArr = [...files];
    setFormDetails({ ...formDetails, file: filesArr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadPromises = formDetails.file.map((fileObj) => {
        const formData = new FormData();
        formData.append("file", fileObj);
        formData.append("upload_preset", "blogapp");
        return axios.post(
          `https://api.cloudinary.com/v1_1/dfoj68y7q/upload`,
          formData
        );
      });

      const responses = await Promise.all(uploadPromises);
      const uploadedFiles = responses.map((res) => ({
        url: res.data.secure_url,
        resource_type: res.data.resource_type,
      }));

      const finalObj = {
        title: formDetails.title,
        description: formDetails.description,
        file: uploadedFiles,
      };

      const res = await axios.post(
        "https://quleep-backend.onrender.com/api/posts",
        finalObj,
        {
          headers: { Authorization: token },
        }
      );

      if (res.data.success) {
        setFormDetails({ title: "", description: "", file: [] });
        setLoading(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setLoading(false);
    }
  };

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
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setUpdatedTitle(post.title);
    setUpdatedContent(post.content);
    setUpdatedFiles([]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedFiles = [];

      if (updatedFiles.length > 0) {
        const uploadPromises = updatedFiles.map((fileObj) => {
          const formData = new FormData();
          formData.append("file", fileObj);
          formData.append("upload_preset", "blogapp");
          return axios.post(
            `https://api.cloudinary.com/v1_1/dfoj68y7q/upload`,
            formData
          );
        });

        const responses = await Promise.all(uploadPromises);
        uploadedFiles = responses.map((res) => ({
          url: res.data.secure_url,
          resource_type: res.data.resource_type,
        }));
      }

      const updateObj = {
        title: updatedTitle,
        content: updatedContent,
        ...(uploadedFiles.length > 0 && { file: uploadedFiles }),
      };

      await axios.put(
        `https://quleep-backend.onrender.com/api/posts/${editingPost._id}`,
        updateObj,
        {
          headers: { Authorization: token },
        }
      );

      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={formDetails.title}
          onChange={(e) => setFormDetails({ ...formDetails, title: e.target.value })}
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
          placeholder="Title"
          required
        />
        <textarea
          value={formDetails.description}
          onChange={(e) => setFormDetails({ ...formDetails, description: e.target.value })}
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
          rows="3"
          placeholder="Description"
          required
        ></textarea>
        <input
          multiple
          type="file"
          onChange={handleFileChange}
          className="w-full mb-2 p-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-3 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

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
                <input
                  multiple
                  type="file"
                  onChange={(e) => setUpdatedFiles([...e.target.files])}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-md"
                />
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
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update"}
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
                {post.file && post.file.map((f, index) => (
                  f.resource_type === "image" ? (
                    <img
                      key={index}
                      src={f.url}
                      alt=""
                      className="mt-4 rounded"
                    />
                  ) : (
                    <video
                      key={index}
                      controls
                      src={f.url}
                      className="mt-4 rounded"
                    ></video>
                  )
                ))}
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
                  <Link
                    to={`/post/${post._id}`}
                    className="bg-blue-500 text-white px-3 py-2 rounded-md"
                  >
                    View Details
                  </Link>
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
