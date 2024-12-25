import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const userStore = useSelector((state) => state.user);
  const token = userStore?.token;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let profilePictureUrl = "";

      if (profilePicture) {
        const formData = new FormData();
        formData.append("file", profilePicture);
        formData.append("upload_preset", "blogapp");

        const uploadResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dfoj68y7q/upload",
          formData
        );

        profilePictureUrl = uploadResponse.data.secure_url;
      }

      await axios.put(
        "https://quleep-backend.onrender.com/api/users/update-profile-picture",
        { profilePicture: profilePictureUrl },
        { headers: { Authorization: token } }
      );

      alert("Profile picture updated successfully!");
    } catch (error) {
      alert("Error updating profile picture: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Profile Picture</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-500 file:text-white hover:file:bg-blue-600"
          />
          {preview && <img src={preview} alt="Preview" className="mt-4 w-24 h-24 rounded-full" />}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Update Profile Picture
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
