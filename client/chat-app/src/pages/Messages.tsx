import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
import { Search } from "lucide-react";
import { useAtom } from "jotai";
import dataFetch from "../axios";
import { currentChats } from "../lib/Atoms";
function Messages() {
  useEffect(() => {
    async function getChats(){
      const chats = await dataFetch.get('/chats/getchats');
      setChats(chats.data);
    }
    getChats(); 
  },[])
  const [openedChat, setOpenedChat] = useState<string | null>(null);
  const [chats,setChats] =  useAtom(currentChats);
  console.log(chats);
  return (
    <div className="bg-custom_background w-5/6">
      <div className="h-full w-1/4 border-r-[1px] border-gray-700 flex flex-col">
        <div className="w-full border-b-[1px] border-gray-700 p-5 flex flex-row items-center text-gray-300 text-2xl font-varela"><div className="mr-auto">Messages</div><div className="bg-light_gray p-2 rounded-full"><Search size={25}/></div></div>
        {chats.map((chat:any,idx)=>{return <ChatCard key={idx} name={(!chat.is_group)?(chat.other_user_name):(chat.chat_name)} />})}
      </div>
    </div>
  );
}
interface ChatCardProps {
  name: string;
}
function ChatCard({name}:ChatCardProps) {
  return (
    <div className="w-full flex justify-center items-center p-4 border-b-[1px] border-gray-700">{name}</div>
  )
}
export default Messages;
