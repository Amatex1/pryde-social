import React, { useState } from "react";
import api from "../../axios";
import "./chatSearchBar.css";

const ChatSearchBar = ({ setChats, userId }) => {
    const [query, setQuery] = useState("");

    const search = async (value) => {
        setQuery(value);

        const res = await axios.get(`/users/search?q=${value}`);
        setChats((prev) =>
            prev.filter((c) =>
                c.members.some((m) =>
                    m.fullname.toLowerCase().includes(value.toLowerCase())
                )
            )
        );
    };

    return (
        <div className="searchWrapper">
            <input
                className="searchInput"
                placeholder="Search..."
                value={query}
                onChange={(e) => search(e.target.value)}
            />
        </div>
    );
};

export default ChatSearchBar;
