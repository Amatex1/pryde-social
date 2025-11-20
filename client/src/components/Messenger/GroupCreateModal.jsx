import React, { useState } from "react";
import api from "../../axios";
import "./groupCreateModal.css";

const GroupCreateModal = ({ onClose }) => {
    const [name, setName] = useState("");
    const [members, setMembers] = useState([]);
    const [image, setImage] = useState(null);

    const profile = JSON.parse(localStorage.getItem("profile"));
    const adminId = profile?.result?._id;

    const createGroup = async () => {
        let icon = null;

        if (image) {
            const form = new FormData();
            form.append("file", image);
            const res = await axios.post("/upload/groupIcon", form);
            icon = res.data.filename;
        }

        await axios.post("/chats/createGroup", {
            name,
            members: [...members, adminId],
            adminId,
            icon,
        });

        onClose();
    };

    return (
        <div className="modalOverlay">
            <div className="modalCard">
                <h2>Create Group</h2>

                <input
                    type="text"
                    placeholder="Group name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="modalInput"
                />

                <label className="modalUpload">
                    Upload Icon
                    <input
                        type="file"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </label>

                <button className="modalButton" onClick={createGroup}>
                    Create
                </button>

                <button className="modalClose" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default GroupCreateModal;
