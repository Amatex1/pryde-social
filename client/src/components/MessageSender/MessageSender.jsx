import React, { useRef, useState } from "react";
import axios from "../../axios";
import "./MessageSender.css";

const MessageSender = ({ onPostCreated }) => {
    const [input, setInput] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const fileRef = useRef(null);

    const profile = JSON.parse(localStorage.getItem("profile"));
    const user = profile?.result;

    const sendPost = async (e) => {
        e.preventDefault();

        if (!input.trim() && !imagePreview) return;

        const form = new FormData();
        form.append("author", user._id);
        form.append("text", input);

        if (fileRef.current.files[0]) {
            form.append("image", fileRef.current.files[0]);
        }

        try {
            await axios.post("/posts", form);
            setInput("");
            setImagePreview(null);
            fileRef.current.value = "";
            onPostCreated();
        } catch (err) {
            console.error("Post creation error:", err);
        }
    };

    return (
        <div className="messageSender">
            <div className="messageSender__top">
                <img
                    className="messageSender__avatar"
                    src={
                        user.profilePhoto
                            ? `${process.env.REACT_APP_BACKEND_URL}retrieve/file/${user.profilePhoto}`
                            : "/default-avatar.png"
                    }
                    alt="avatar"
                />
                <form>
                    <input
                        className="messageSender__input"
                        placeholder={`What's on your mind, ${user.nickname || user.fullname}?`}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />

                    <button onClick={sendPost} type="submit">
                        Hidden submit
                    </button>
                </form>
            </div>

            {imagePreview && (
                <div className="composerPreview">
                    <img src={imagePreview} alt="" />
                </div>
            )}

            <div
                className="messageSender__bottom"
                onClick={() => fileRef.current.click()}
            >
                <div className="messageSender__option">📷 Photo</div>

                <input
                    type="file"
                    hidden
                    ref={fileRef}
                    onChange={(e) =>
                        setImagePreview(URL.createObjectURL(e.target.files[0]))
                    }
                />
            </div>
        </div>
    );
};

export default MessageSender;
