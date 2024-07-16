import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
import { Search } from "lucide-react";
import { useAtom } from "jotai";
import dataFetch from "../axios";
import { currentChats,openedChat } from "../lib/Atoms";
import OpenChat from "../components/OpenChat";
function Messages() {
  useEffect(() => {
    async function getChats(){
      const chats = await dataFetch.get('/chats/getchats');
      setChats(chats.data);
    }
    getChats(); 
  },[])
  const [currentChat, setCurrentChat] = useAtom(openedChat);
  const [chats,setChats] =  useAtom(currentChats);
  console.log(chats);
  return (
    <div className="bg-custom_background w-5/6 flex flex-row">
      <div className="h-[100vh] w-1/4 border-r-[1px] border-gray-700 flex flex-col">
        <div>
          <div className="w-full border-b-[1px] border-gray-700 p-5 flex flex-row items-center text-gray-300 text-2xl font-varela"><div className="mr-auto">Messages</div><div className="bg-light_gray h-12 w-12 flex justify-center items-center rounded-full"><Search size={20}/></div></div>
          {chats.map((chat:any,idx)=>{return <ChatCard key={idx} name={(!chat.is_group)?(chat.other_user_name):(chat.chat_name)} last_message={chat.last_message_text} image={chat.other_user_image_url}/>})}
        </div>
      </div>
      <div className="h-full w-3/4">
        {(currentChat == null)?(<div className="w-full h-full flex justify-center items-center text-xl text-gray-200 font-varela">No Chats selected yet.</div>):(<OpenChat/>)}
      </div>
    </div>
  );
}
interface ChatCardProps {
  name: string;
  last_message?: string | null;
  image?: string;
  time?: string | null;
}
function ChatCard({name,last_message,image,time}:ChatCardProps) {
  const [currentChat, setCurrentChat] = useAtom(openedChat);
  return (
    <div onClick={()=>{setCurrentChat('')}} className="w-full flex justify-center items-center hover:bg-navbar_background hover:border-none hover:cursor-pointer p-4 border-b-[1px] border-gray-700 flex-row">
      <img src={image} className="h-12 w-12 rounded-full mr-auto"/>
      <div className="flex flex-col w-full h-full pl-4">
        <div className="font-varela text-gray-200 mb-auto">{name}</div>
        {(last_message==null)?(<div className="font-varela text-gray-400 text-sm">No messages yet.</div>):(<div className="font-varela text-gray-400 text-sm">{last_message}</div>)}
      </div>
    </div>
  )
}
export default Messages;
