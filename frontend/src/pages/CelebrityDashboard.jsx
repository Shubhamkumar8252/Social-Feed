import { useState } from "react";
import API from "../utils/api";
import socket from "../sockets/socket";
import "./celebrity.css";

export default function CelebrityDashboard() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await API.post("/posts", formData);
      setContent("");
      setImage(null);
      setPreview("");
    } catch {
      alert("Failed to post");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="dashboard-container">
      <h2>Create a Post</h2>
      <textarea
        placeholder="Write your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && <img src={preview} alt="Preview" className="preview-image" />}

      <button onClick={handlePost} disabled={!content.trim()}>
        Post
      </button>
    </div>
  );
}
