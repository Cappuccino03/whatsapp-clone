import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import { InsertEmoticon } from "@material-ui/icons";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MicIcon from "@material-ui/icons/Mic";
import randomColor from "randomcolor";
import "./chat.css";

import db from "../../firebase/firebase";
import { UserContext } from "../../context/UserContext";

const Chat = () => {
  const inputRef = useRef("");
  const { chatId } = useParams();
  const [chatName, setChatName] = useState("");
  const { user, darkTheme } = useContext(UserContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (chatId) {
      unsubscribe = db
        .collection("chats")
        .doc(chatId)
        .onSnapshot((snapshot) => setChatName(snapshot.data().name));

      db.collection("chats")
        .doc(chatId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    let obj = document.querySelector(".chat__body");
    obj.scrollTop = obj.scrollHeight;
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef === "") return;

    db.collection("chats").doc(chatId).collection("messages").add({
      name: user.name,
      text: inputRef.current.value,
      timestamp: new Date(),
    });
    inputRef.current.value = "";
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar
          className="avatar"
          src={`https://ui-avatars.com/api/?name=${chatName}&length=1&background=random&bold=true`}
        />
        <div className="chat__headerInfo">
          <h3>{chatName}</h3>
          <p>
            {messages.length === 0
              ? ""
              : `Last seen at ${new Date(
                  messages[messages.length - 1]?.timestamp.seconds * 1000
                ).toLocaleTimeString()}`}
          </p>
        </div>
      </div>
      <div className={`chat__body ${darkTheme && "darkTheme"}`}>
        {messages.length === 0 ? (
          <p className="chat__body__initial">No messages</p>
        ) : (
          messages.map((message) => (
            <p
              key={message.timestamp.seconds}
              className={`chat__message ${
                message.name === user.name && "chat__sender"
              }`}
            >
              {message.name !== user.name && (
                <span
                  className="chat__name"
                  style={{
                    color: randomColor(),
                  }}
                >
                  {message.name}
                </span>
              )}
              <span className="chat__text">{message.text}</span>
              <span className="chat__time">
                {new Date(
                  message.timestamp.seconds * 1000
                ).toLocaleTimeString()}
              </span>
            </p>
          ))
        )}
      </div>
      <div className="chat__footer">
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <IconButton>
          <AttachFileIcon />
        </IconButton>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type a message"
            ref={inputRef}
            // value={inputMessage}
            // onChange={(e) => setInputMessage(e.target.value)}
          />
          <button type="submit">button</button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;