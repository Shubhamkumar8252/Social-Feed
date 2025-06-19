import { useEffect, useState } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";
import socket from "../sockets/socket";
import "./public.css";

export default function PublicFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [celebrities, setCelebrities] = useState([]);

  const loadCelebrities = async () => {
    try {
      const res = await API.get("/auth/celebrities");
      setCelebrities(res.data);
    } catch {
      console.error("Failed to load celebrities");
    }
  };

  const handleFollow = async (celebrityUsername) => {
    try {
      await API.post("/follow", {
        follower: user.username,
        followee: celebrityUsername
      });
      alert(`You followed ${celebrityUsername}`);
      setPage(1);
      setPosts([]);
      setHasMore(true);
      loadMore();
    } catch {
      alert("Follow failed");
    }
  };

  const loadMore = async () => {
    if (!user || !user.username || !hasMore || loading) return;
    setLoading(true);
    try {
      const res = await API.get(`/posts/following?user=${user.username}&page=${page}`);
      if (res.data.length === 0) setHasMore(false);
      else {
        setPosts(prev => [...prev, ...res.data]);
        setPage(prev => prev + 1);
      }
    } catch {
      alert("Error loading posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.username) {
      socket.emit("register_user", user.username);
      loadCelebrities();
    }

    socket.on("new_notification", (post) => {
      setNotifications((prev) => [post, ...prev]);
      setShowBadge(true);
    });

    loadMore();

    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom && hasMore && !loading) loadMore();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      socket.off("new_notification");
    };
  }, [user]);

  return (
    <div className="public-feed">
      <div className="feed-header">
        <h2 className="feed-title">Your Feed</h2>
        <button className="notif-button" onClick={() => {
          setShowNotifications(!showNotifications);
          setShowBadge(false);
        }}>
          {showBadge && <span className="notif-badge" />}
        </button>
      </div>

      {showNotifications && (
        <div className="notif-panel">
          <h4>New Posts</h4>
          {notifications.length === 0 ? (
            <p className="notif-empty">No new notifications</p>
          ) : (
            notifications.map((post, i) => (
              <div key={i} className="notif-post">
                <strong>{post.author}</strong>: {post.content}
              </div>
            ))
          )}
        </div>
      )}

      {posts.length === 0 && celebrities.length > 0 && (
        <div className="follow-section">
          <h3>Follow Celebrities</h3>
          <div className="celebrity-list">
            {celebrities.map(c => (
              <button key={c.username} onClick={() => handleFollow(c.username)}>
                ➕ {c.username}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="posts">
        {posts.map((post, i) => (
          <div key={i} className="post-card">
            <p className="post-author">{post.author}</p>
            <p>{post.content}</p>
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="post-image"
                loading="lazy"
              />
            )}
          </div>
        ))}
      </div>

      {loading && <p className="loading">Loading more...</p>}
      {!hasMore && posts.length > 0 && <p className="end">No more posts</p>}
    </div>
  );
}
