import { Star, User, Send, Smile } from "lucide-react";
import { useState, useEffect } from "react";
import dataFetch from "../axios";
import { useAtom } from "jotai";
import { userAtom } from "../App";
import "./OpenChat.css";
import { globalSocket } from "../lib/Atoms";
import { Socket } from "socket.io-client";
import { all } from "axios";
interface OpenChat {
  chat_id: string;
  isGroup: boolean;
  name: string;
  image: string;
  oldMessages: any;
}
interface Message {
  sender_id: string | undefined;
  sender?: string;
  message: string;
  time: string;
  message_image?: string | null;
  sender_image?: string | null;
  chatId?: string;
}
function OpenChat({ chat_id, isGroup, name, image, oldMessages }: OpenChat) {
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<Message | null>(null);
  const [user, setUser] = useAtom(userAtom);
  const [userSocket, setUserSocket] = useAtom(globalSocket);
  useEffect(() => {
    setAllMessages(
      oldMessages.map((msg: any) => {
        return {
          sender_id: msg.sender_id,
          sender: msg.username,
          message: msg.message_text,
          time: msg.sent_at,
          message_image: msg.message_image,
          sender_image: msg.sender_image,
        };
      })
    );
  }, [oldMessages]);
  useEffect(() => {
    const handler = (msg: Message) => {
      setAllMessages((allMessages) => [...allMessages, msg]);
    };
    userSocket?.on("receive_message", handler);

    return () => {
      userSocket?.off("receive_message", handler);
    };
  }, [userSocket]);
  async function sendMessage(message: Message | null) {
    if (message != null) {
      let test = {
        message: message.message,
        sender_id: user?.data.user?.id,
        time: message.time,
        message_image: message.message_image,
        chatId: chat_id,
      };
      userSocket?.emit("send_message", test);
      setAllMessages([...allMessages, message]);
      await dataFetch.post("/chats/sendmessage", null, {
        params: {
          chatId: chat_id,
          messageText: message.message,
          time: message.time,
          image: message.message_image,
        },
      });
    } else {
      alert("Type a message first");
    }
  }
  return (
    <div className="w-full h-full flex flex-col">
      <div className="header p-5 border-b-[1px] border-gray-700 flex flex-row">
        <img src={image} alt="" className="h-12 w-12 rounded-full" />
        <div className="h-full pl-5">
          <div className="text-lg text-gray-200 font-varela mb-auto">
            {name}
          </div>
          <div className="text-sm text-gray-400 font-varela mb-auto">
            Offline
          </div>
        </div>
        <div className="h-auto flex items-center gap-4 justify-center ml-auto flex flex-row">
          <div className="rounded-3xl bg-light_gray pt-2 pb-2 pl-4 pr-4 flex flex-row justify-center items-center  gap-2">
            <Star size={20} color="#e5e7eb" />
            <div className="font-varela text-sm text-gray-200">Priority</div>
          </div>
          <div className="rounded-3xl bg-light_gray pt-2 pb-2 pl-4 pr-4 flex flex-row justify-center items-center  gap-2">
            <User size={20} color="#e5e7eb" />
            <div className="font-varela text-sm text-gray-200">Profile</div>
          </div>
        </div>
      </div>
      <div className="body flex flex-col h-full w-full">
        {allMessages.map((msg, idx) => {
          return (
            <div
              key={idx}
              className={
                msg.sender_id == user?.data.user?.id
                  ? "message bg-right_message ml-auto mt-2 mb-2 p-2 rounded-3xl"
                  : "message bg-light_gray mr-auto mt-2 mb-2 p-2 rounded-3xl"
              }
            >
              {msg.message}
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex flex-row">
        <div className="h-full w-1/12 border-gray-700 bg-light_gray flex items-center justify-center">
          <Smile
            size={30}
            color="#e5e7eb"
            className="ml-4 mr-4 mt-auto mb-auto"
          />
        </div>
        <div className="form-control w-10/12">
          <input
            onChange={(e) => {
              setMessage({
                message: e.target.value,
                sender_id: user?.data.user?.id,
                time: new Date().toISOString().slice(0, 19).replace("T", " "),
              });
            }}
            className="input input-alt"
            placeholder="Type something...."
            required
            type="text"
          />
          <span className="input-border input-border-alt"></span>
        </div>
        <div
          onClick={() => {
            sendMessage(message);
          }}
          className="h-full w-1/12 border-gray-700 bg-light_gray flex items-center justify-center"
        >
          <Send
            size={30}
            color="#e5e7eb"
            className="ml-4 mr-4 mt-auto mb-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default OpenChat;
