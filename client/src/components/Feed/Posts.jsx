import React from "react";
import Post from "./Post";

const Posts = ({ posts }) => {
    return (
        <div className="postsWrapper">
            {posts.map((p) => (
                <Post key={p._id} post={p} />
            ))}
        </div>
    );
};

export default Posts;
