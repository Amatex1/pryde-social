import React, { useState } from "react";
import axios from "../../axios";
import "./editProfile.css";
import EditProfileModal from "./components/EditProfileModal";

const EditProfileModal = ({ viewer, onClose, refresh }) => {
    const [nickname, setNickname] = useState(viewer.nickname || "");
    const [pronouns, setPronouns] = useState(viewer.pronouns || "");
    const [gender, setGender] = useState(viewer.gender || "");
    const [relationship, setRelationship] = useState(viewer.relationship || "");
    const [bio, setBio] = useState(viewer.bio || "");
    const [socials, setSocials] = useState(viewer.socials || []);

    const updateProfile = async () => {
        try {
            await axios.post(
                "/updateProfile",
                {
                    nickname,
                    pronouns,
                    gender,
                    relationship,
                    bio,
                    socials,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            refresh();
            onClose();
        } catch (err) {
            console.error("Profile update error:", err);
        }
    };

    const addSocial = () => {
        setSocials([...socials, ""]);
    };

    const updateSocial = (index, value) => {
        const updated = [...socials];
        updated[index] = value;
        setSocials(updated);
    };

    const removeSocial = (index) => {
        setSocials(socials.filter((_, i) => i !== index));
    };

    return (
        <div className="editProfileOverlay">
            <div className="editProfileModal">
                <h2>Edit Profile</h2>

                <div className="modalSection">
                    <label>Nickname</label>
                    <input
                        type="text"
                        placeholder="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>

                <div className="modalSection">
                    <label>Pronouns</label>
                    <select value={pronouns} onChange={(e) => setPronouns(e.target.value)}>
                        <option value="">Select…</option>
                        <option value="He/Him">He/Him</option>
                        <option value="She/Her">She/Her</option>
                        <option value="They/Them">They/Them</option>
                        <option value="He/They">He/They</option>
                        <option value="She/They">She/They</option>
                    </select>
                </div>

                <div className="modalSection">
                    <label>Gender</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select…</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-Binary">Non-Binary</option>
                        <option value="Transgender">Transgender</option>
                        <option value="Genderfluid">Genderfluid</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="modalSection">
                    <label>Relationship</label>
                    <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                    >
                        <option value="">Select…</option>
                        <option value="Single">Single</option>
                        <option value="In a Relationship">In a Relationship</option>
                        <option value="Engaged">Engaged</option>
                        <option value="Married">Married</option>
                        <option value="Complicated">It's Complicated</option>
                    </select>
                </div>

                <div className="modalSection">
                    <label>Bio</label>
                    <textarea
                        placeholder="About you…"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>

                <div className="modalSection">
                    <label>Social Links</label>

                    {socials.map((item, index) => (
                        <div className="socialItem" key={index}>
                            <input
                                type="text"
                                placeholder="e.g., https://instagram.com/yourname"
                                value={item}
                                onChange={(e) => updateSocial(index, e.target.value)}
                            />

                            <button
                                className="removeBtn"
                                onClick={() => removeSocial(index)}
                            >
                                ✕
                            </button>
                        </div>
                    ))}

                    <button className="addSocialBtn" onClick={addSocial}>
                        + Add Social Link
                    </button>
                </div>

                <div className="modalActions">
                    <button className="saveBtn" onClick={updateProfile}>
                        Save
                    </button>

                    <button className="cancelBtn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
