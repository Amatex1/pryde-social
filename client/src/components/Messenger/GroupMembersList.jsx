import React from "react";
import "./groupMembersList.css";

const GroupMembersList = ({ chat }) => {
    return (
        <div className="membersWrapper">
            <h4>Members</h4>

            {chat.members.map((m) => (
                <div key={m._id} className="memberRow">
                    <img
                        src={
                            m.profilePhoto
                                ? `http://localhost:5000/retrieve/file/${m.profilePhoto}`
                                : "/default-avatar.png"
                        }
                        alt=""
                        className="memberAvatar"
                    />

                    <div className="memberInfo">
                        <p className="memberName">{m.nickname || m.fullname}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupMembersList;
