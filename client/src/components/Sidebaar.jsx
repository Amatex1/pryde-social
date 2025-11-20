import React from "react";
import "./sidebaar.css";
import SidebaarRow from "./SidebaarRow";
import PeopleIcon from "@material-ui/icons/People";
import MessageIcon from "@material-ui/icons/Message";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import StorefrontIcon from "@material-ui/icons/Storefront";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PagesIcon from "@material-ui/icons/Pages";
import { NavLink } from "react-router-dom";

const Sidebaar = () => {
    const user = JSON.parse(localStorage.getItem("profile"))?.result;

    return (
        <div className="sidebar">
            <NavLink exact to="/account">
                <SidebaarRow title={user?.name} src={user?.imageUrl} />
            </NavLink>

            <NavLink exact to="/friends">
                <SidebaarRow title="Friends" Icon={PeopleIcon} />
            </NavLink>

            <NavLink exact to="/messenger">
                <SidebaarRow title="Messages" Icon={MessageIcon} />
            </NavLink>

            <NavLink exact to="/videos">
                <SidebaarRow title="Videos" Icon={VideoLibraryIcon} />
            </NavLink>

            <SidebaarRow title="Marketplace" Icon={StorefrontIcon} />
            <SidebaarRow title="More" Icon={ExpandMoreIcon} />
        </div>
    );
};

export default Sidebaar;
