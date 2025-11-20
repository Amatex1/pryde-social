import React from "react";
import "./sidebaarRow.css";
import { Avatar } from "@material-ui/core";

const SidebaarRow = ({ title, src, Icon }) => {
    return (
        <div className="sidebarRow">
            {Icon && <Icon htmlColor="var(--pryde-primary)" />}
            {src && <Avatar src={src} />}
            <h5>{title}</h5>
        </div>
    );
};

export default SidebaarRow;
