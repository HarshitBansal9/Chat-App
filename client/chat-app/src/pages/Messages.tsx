import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Search } from "lucide-react";
import { useAtom } from "jotai";
import dataFetch from "../axios";
import { sessionAtom } from "../App";
import profile_image from "../assets/images/profile_image.png";
import {
  currentChats,
  openedChat,
  globalSocket,
  userDetails,
} from "../lib/Atoms";
import OpenChat from "../components/OpenChat";
function Messages() {
  const [userSocket, setUserSocket] = useAtom(globalSocket);
  const [session, setSession] = useAtom(sessionAtom);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useAtom(userDetails);
  useEffect(() => {
    let socket: any;
    if (session) {
      console.log(session, userSocket);
      socket = io("http://localhost:3001/chat", {
        query: { token: session.access_token },
      });
      console.log("Socket", socket, session);
      setUserSocket(socket);
    }

    async function getChats() {
      try {
        const chats = await dataFetch.get("/chats/getchats");
        console.log("Chats", chats);
        setChats(chats.data);
      } catch (error) {
        console.log("Error", error);
      }
    }
    getChats();

    async function getchatsNew() {
      const chats = await dataFetch.get("/chats/getchatsnew");
      console.log("Chats New", chats);
      //setChats(chats.data);
    }
    getchatsNew();
    
    async function getMessages() {
      const messages = await dataFetch.get("/chats/getmessages");
      setMessages(messages.data);
    }
    getMessages();
    return () => {
      socket?.disconnect();
    };
  }, [session]);

  const [currentChat, setCurrentChat] = useAtom(openedChat);
  const [chats, setChats] = useAtom(currentChats);
  return (
    <div className="flex w-5/6 flex-row bg-custom_background">
      <div className="flex h-[100vh] w-1/4 flex-col border-r-[1px] border-gray-700">
        <div>
          <div className="flex w-full flex-row items-center border-b-[1px] border-gray-700 p-5 font-varela text-2xl text-gray-300">
            <div className="mr-auto">Messages</div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-light_gray">
              <Search size={20} />
            </div>
          </div>
          {chats.map((chat: any, idx) => {
            return (
              <ChatCard
                key={idx}
                name={!chat.is_group ? chat.other_user_name : chat.chat_name}
                last_message={chat.last_message_text}
                image={chat.other_user_image_url}
                chat_id={chat.chat_id}
                isGroup={chat.is_group}
              />
            );
          })}
        </div>
      </div>
      <div className="h-screen w-3/4">
        {currentChat == null ? (
          <div className="flex h-full w-full items-center justify-center font-varela text-xl text-gray-200">
            No Chats selected yet.
          </div>
        ) : (
          <OpenChat
            chat_id={currentChat.chat_id}
            isGroup={currentChat.isGroup}
            name={currentChat.name}
            image={currentChat.image}
            oldMessages={messages.filter((msg: any) => {
              return msg.chat_id == currentChat?.chat_id;
            })}
            sender_image={user?.image_url}
          />
        )}
      </div>
    </div>
  );
}
interface ChatCardProps {
  name: string;
  last_message?: string | null;
  image: string;
  time?: string | null;
  chat_id: string;
  isGroup: boolean;
}
function ChatCard({
  name,
  last_message,
  image,
  time,
  chat_id,
  isGroup,
}: ChatCardProps) {
  const [imageLoaded,setImageLoaded] = useState(false);
  const [currentChat, setCurrentChat] = useAtom(openedChat);
  return (
    <div
      onClick={() => {
        setCurrentChat({
          chat_id: chat_id,
          isGroup: isGroup,
          name: name,
          image: image
        });
      }}
      className="flex w-full flex-row items-center justify-center border-b-[1px] border-gray-700 p-4 hover:cursor-pointer hover:border-none hover:bg-navbar_background"
    >
      <img src={(imageLoaded)?(image):(profile_image)} onLoad={()=>{setImageLoaded(true)}} className="mr-auto h-12 w-12 rounded-full" />
      <div className="flex h-full w-full flex-col pl-4">
        <div className="mb-auto font-varela text-gray-200">{name}</div>
        {last_message == null ? (
          <div className="font-varela text-sm text-gray-400">
            No messages yet.
          </div>
        ) : (
          <div className="font-varela text-sm text-gray-400">
            {last_message}
          </div>
        )}
      </div>
    </div>
  );
}
export default Messages;
