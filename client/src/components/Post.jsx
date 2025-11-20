import React, { useState } from "react";
import api from "../../axios";
import "./Post.css";
import Comments from "./Comments";

const Post = ({ post }) => {
    const profile = JSON.parse(localStorage.getItem("profile"));
    const userId = profile?.result?._id;

    const [showComments, setShowComments] = useState(false);

    const isLiked = post.likes.includes(userId);

    const toggleLike = async () => {
        try {
            if (isLiked) {
                await axios.delete("/likes", {
                    data: { postId: post._id, userId },
                });
            } else {
                await axios.post("/likes", {
                    postId: post._id,
                    userId,
                });
            }
        } catch (err) {
            console.error("Like error:", err);
        }
    };

    return (
        <div className="post">
            {/* Header */}
            <div className="post__top">
                <img
                    className="post__avatar"
                    src={
                        post.author?.profilePhoto
                            ? `${process.env.REACT_APP_BACKEND_URL}retrieve/file/${post.author.profilePhoto}`
                            : "/default-avatar.png"
                    }
                    alt=""
                />

                <div className="post__topInfo">
                    <h3>{post.author?.nickname || post.author?.fullname}</h3>
                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Text content */}
            {post.text && <div className="post__bottom">{post.text}</div>}

            {/* Image */}
            {post.image && (
                <div className="post__image">
                    <img
                        src={`${process.env.REACT_APP_BACKEND_URL}retrieve/file/${post.image}`}
                        alt="post"
                    />
                </div>
            )}

            {/* Like + Comment buttons */}
            <div className="post__options">
                <div
                    className={`post__option ${isLiked ? "liked" : ""}`}
                    onClick={toggleLike}
                >
                    ❤️ {post.likes.length}
                </div>

                <div
                    className="post__option"
                    onClick={() => setShowComments((prev) => !prev)}
                >
                    💬 Comments
                </div>
            </div>

            {/* Comments section */}
            {showComments && <Comments postId={post._id} />}
        </div>
    );
};

export default Post;
