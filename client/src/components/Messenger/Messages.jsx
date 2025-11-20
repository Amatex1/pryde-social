import React from "react";
import ReactionPicker from "./ReactionPicker";
import "./messages.css";
import api from "../../axios";

const Messages = ({ msg, currentUserId }) => {
    const isMine = msg.sender?._id === currentUserId;

    const fileURL = msg.file
        ? `http://localhost:5000/retrieve/file/${msg.file}`
        : null;

    const audioURL = msg.audio
        ? `http://localhost:5000/retrieve/file/${msg.audio}`
        : null;

    return (
        <div className={`msgRow ${isMine ? "mine" : "theirs"}`}>
            <div className="msgBubble">

                {msg.text && <p>{msg.text}</p>}

                {fileURL && (
                    <a
                        href={fileURL}
                        target="_blank"
                        rel="noreferrer"
                        className="fileAttachment"
                    >
                        📎 Attachment
                    </a>
                )}

                {audioURL && (
                    <audio controls className="audioAttachment">
                        <source src={audioURL} />
                    </audio>
                )}

                <ReactionPicker message={msg} />

                {isMine && (
                    <span className="msgStatus">
                        {msg.seenAt
                            ? "Seen ✓✓"
                            : msg.deliveredAt
                                ? "Delivered ✓✓"
                                : "Sent ✓"}
                    </span>
                )}
            </div>

            {msg.reactions?.length > 0 && (
                <div className="reactionDisplay">
                    {msg.reactions.map((r) => (
                        <span key={r.userId} className="reactionEmoji">
                            {r.emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
