import React, { useState } from "react";
import "./post.css";
import { Avatar } from "@material-ui/core";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import CommentIcon from "@material-ui/icons/Comment";
import ShareIcon from "@material-ui/icons/Share";

const Post = ({ userImage, userName, timestamp, image, caption }) => {
    const [like, setLike] = useState(false);

    return (
        <div className="post">
            <div className="post__top">
                <Avatar src={userImage} />
                <div className="post__topInfo">
                    <h3>{userName}</h3>
                    <p>{new Date(parseInt(timestamp)).toLocaleString()}</p>
                </div>
            </div>

            <div className="post__middle">
                <p>{caption}</p>
                {image && <img src={`http://localhost:5000/retrieve/image/?name=${image}`} alt="" />}
            </div>

            <div className="post__bottom">
                <div
                    className={`post__action ${like ? "liked" : ""}`}
                    onClick={() => setLike(!like)}
                >
                    <ThumbUpAltIcon />
                    <span>{like ? "Liked" : "Like"}</span>
                </div>

                <div className="post__action">
                    <CommentIcon />
                    <span>Comment</span>
                </div>

                <div className="post__action">
                    <ShareIcon />
                    <span>Share</span>
                </div>
            </div>
        </div>
    );
};

export default Post;
