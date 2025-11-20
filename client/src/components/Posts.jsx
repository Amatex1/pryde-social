import React, { useEffect, useState } from "react";
import Post from "./Post";
import axios from "../axios.js";

const Posts = () => {
    const [postData, setPostData] = useState({ data: [] });

    const syncFeed = async () => {
        try {
            const resp = await axios.get("/retrieve/posts");
            setPostData(resp);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        syncFeed();
    }, []);

    return (
        <div>
            {postData.data.map((post, index) => (
                <Post
                    key={index}
                    userImage={post.avatar}
                    userName={post.user}
                    timestamp={post.timestamp}
                    image={post.imgName}
                    caption={post.text}
                />
            ))}
        </div>
    );
};

export default Posts;
