import React, { useEffect, useState } from "react";
import axios from "../../axios";
import Pusher from "pusher-js";
import Posts from "./Posts";
import MessageSender from "../MessageSender/MessageSender";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const loadFeed = async () => {
    try {
      const res = await axios.get("/posts/feed");
      setPosts(res.data);
    } catch (err) {
      console.error("Feed load error:", err);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  // Pusher Listener
  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: process.env.REACT_APP_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe("feed-channel");

    channel.bind("new-post", (post) => {
      setPosts((prev) => [post, ...prev]);
    });

    channel.bind("new-like", ({ postId, userId }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: [...p.likes, userId] } : p
        )
      );
    });

    channel.bind("remove-like", ({ postId, userId }) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, likes: p.likes.filter((id) => id !== userId) }
            : p
        )
      );
    });

    channel.bind("new-comment", (comment) => {
      setPosts((prev) =>
        prev.map((p) =>
          p._id === comment.postId
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p
        )
      );
    });

    return () => {
      pusher.unsubscribe("feed-channel");
    };
  }, []);

  return (
    <div className="feed">
      <MessageSender onPostCreated={loadFeed} />

      <Posts posts={posts} />
    </div>
  );
};

export default Feed;
