import React from "react";
import "./feed.css";

// FIXED: correct path to MessageSender
import MessageSender from "./MessageSender/MessageSender";

import StoryReel from "./StoryReel";
import Posts from "./Posts";

const Feed = () => {
  return (
    <div className="feed">
      <StoryReel />
      <MessageSender />
      <Posts />
    </div>
  );
};

export default Feed;
