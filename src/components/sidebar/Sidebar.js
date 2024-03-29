import React, { useState, useEffect, useContext } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import "./sidebar.css";

import SidebarChat from "../sidebarChat/SidebarChat";
import { UserContext } from "../../context/UserContext";
import db from "../../firebase/firebase";

const Sidebar = ({ setModal }) => {
  const { user, themeToggle, darkTheme } = useContext(UserContext);
  const [chatNames, setChatNames] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setChatNames(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar className="avatar" src={user?.profileURL} />
        <div className="sidebar__header__right">
          <IconButton onClick={themeToggle}>
            {!darkTheme ? (
              <Brightness4Icon className="darkmode__icon" />
            ) : (
              <Brightness7Icon className="darkmode__icon" />
            )}
          </IconButton>
          <IconButton onClick={setModal}>
            <ChatIcon className="chat__icon" />
          </IconButton>
          <IconButton>
            <MoreVertIcon className="more__icon" />
          </IconButton>
        </div>
      </div>

      <div className="sidebar__search">
        <div className="search__box">
          <SearchIcon />
          <input
            type="text"
            className="search__field"
            placeholder="Search or start new chat"
          />
        </div>
      </div>
      <div className="sidebar__chats">
        {chatNames.length === 0 ? (
          <p className="sidebar__chats__initial">
            You don't have any rooms yet..!
          </p>
        ) : (
          chatNames.map((chatName) => (
            <SidebarChat
              key={chatName.id}
              id={chatName.id}
              name={chatName.data.name}
            />
          ))
        )}

        {/* {!chatNames ? (
          <h1>hello</h1>
        ) : (
          chatNames.map((chatName) => (<SidebarChat
            key={chatName.id}
            id={chatName.id}
            name={chatName.data.name}
          />
        )))
        } */}
      </div>
    </div>
  );
};

export default Sidebar;