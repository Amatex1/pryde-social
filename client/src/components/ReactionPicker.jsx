import React, { useState } from "react";
import axios from "../axios";
import "./reactionPicker.css";

const reactions = ["❤️", "😂", "👍", "😮", "😢", "😡"];

const ReactionPicker = ({ message }) => {
    const [open, setOpen] = useState(false);

    const profile = JSON.parse(localStorage.getItem("profile"));
    const userId = profile?.result?._id;

    const react = async (emoji) => {
        await axios.post("/message/react", {
            messageId: message._id,
            userId,
            emoji,
        });
    };

    return (
        <div className="reactionWrapper">
            <button className="reactionToggle" onClick={() => setOpen(!open)}>
                🙂
            </button>

            {open && (
                <div className="reactionMenu">
                    {reactions.map((e) => (
                        <span
                            key={e}
                            className="reactionOption"
                            onClick={() => react(e)}
                        >
                            {e}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReactionPicker;
