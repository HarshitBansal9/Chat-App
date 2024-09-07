import { Star, User, Send, Smile } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import dataFetch from "../axios";
import { useAtom } from "jotai";
import { userAtom } from "../App";
import "./OpenChat.css";
import profile_image from "../assets/images/profile_image.png";
import { globalSocket } from "../lib/Atoms";
import { Socket } from "socket.io-client";
import { all } from "axios";
interface OpenChat {
  chat_id: string;
  isGroup: boolean;
  name: string;
  image: string;
  oldMessages: any;
  sender_image: string | undefined;
}
interface Message {
  sender_id: string | undefined;
  sender?: string;
  message: string;
  time: string;
  message_image?: string | null;
  sender_image: string | undefined;
  chatId?: string;
}
function OpenChat({
  chat_id,
  isGroup,
  name,
  image,
  oldMessages,
  sender_image,
}: OpenChat) {
  const listRef = useRef<HTMLDivElement>(null);
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [imageLoaded,setImageLoaded] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [user, setUser] = useAtom(userAtom);
  const [txt, setTxt] = useState("");
  const [userSocket, setUserSocket] = useAtom(globalSocket);
  function formatDate(dateString: string) {
    const date = new Date(dateString);

    // Days of the week array
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Get day, date, and time
    const dayOfWeek = daysOfWeek[date.getUTCDay()];
    const dateOfMonth = date.getUTCDate();
    const month = date.toLocaleString("default", { month: "short" });
    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format the output
    const formattedDate = `${dateOfMonth} ${month} ${time}`;

    return formattedDate;
  }
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
      }),
    );
  }, [oldMessages]);
  useEffect(() => {
    console.log("Sender image", sender_image);
  }, []);
  useEffect(() => {
    //3bring the last item into view
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [allMessages]);

  useEffect(() => {
    const handler = (msg: Message) => {
      console.log(msg);
      setAllMessages((allMessages) => [...allMessages, msg]);
    };
    userSocket?.on("receive_message", handler);

    return () => {
      userSocket?.off("receive_message", handler);
    };
  }, [userSocket]);
  async function sendMessage(message: Message | null) {
    setTxt("");
    if (message != null) {
      let test = {
        message: message.message,
        sender_id: user?.data.user?.id,
        time: message.time,
        message_image: message.message_image,
        chatId: chat_id,
        sender_image: sender_image,
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
    <div className="flex h-full w-full flex-col">
      <div className="header flex flex-row border-b-[1px] border-gray-700 p-5">
        <img src={(imageLoaded)?(image):(profile_image)} onLoad={()=>{setImageLoaded(true)}}  alt="" className="h-12 w-12 rounded-full" />
        <div className="h-full pl-5">
          <div className="mb-auto font-varela text-lg text-gray-200">
            {name}
          </div>
          <div className="mb-auto font-varela text-sm text-gray-400">
            Offline
          </div>
        </div>
        <div className="ml-auto flex h-auto flex-row items-center justify-center gap-4">
          <div className="flex flex-row items-center justify-center gap-2 rounded-3xl bg-light_gray pb-2 pl-4 pr-4 pt-2">
            <Star size={20} color="#e5e7eb" />
            <div className="font-varela text-sm text-gray-200">Priority</div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2 rounded-3xl bg-light_gray pb-2 pl-4 pr-4 pt-2">
            <User size={20} color="#e5e7eb" />
            <div className="font-varela text-sm text-gray-200">Profile</div>
          </div>
        </div>
      </div>
      <div
        ref={listRef}
        className="body flex h-full w-full flex-col overflow-y-auto scrollbar scrollbar-thumb-slate-700"
      >
        {allMessages.map((msg, idx) => {
          return msg.sender_id == user?.data.user?.id ? (
            <div key={idx} className="ml-auto mr-4 mt-4 flex flex-col">
              <div className="max-w-[500px] rounded-lg bg-right_message p-3 font-varela text-gray-200">
                {msg.message}
              </div>
              <div className="mr-auto font-varela text-xs text-gray-400">
                {formatDate(msg.time)}
              </div>
            </div>
          ) : (
            <div key={idx} className="ml-4 mr-auto mt-4 flex flex-col">
              <div className="flex flex-row">
                {msg.sender_image != undefined ? (
                  <img
                    src={msg.sender_image}
                    alt=""
                    className="mb-1 mr-2 mt-auto h-9 w-9 rounded-full"
                  />
                ) : (
                  <div></div>
                )}
                <div className="max-w-[500px] rounded-lg bg-left_message p-3 font-varela text-gray-200">
                  {msg.message}
                </div>
              </div>
              <div className="ml-auto font-varela text-xs text-gray-400">
                {formatDate(msg.time)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-auto flex flex-row">
        <div className="flex h-full w-1/12 items-center justify-center border-gray-700 bg-light_gray">
          <Smile
            size={30}
            color="#e5e7eb"
            className="mb-auto ml-4 mr-4 mt-auto"
          />
        </div>
        <div className="form-control w-10/12">
          <input
            value={txt}
            onKeyDown={(e) => {
              e.key === "Enter"
                ? sendMessage(message)
                : console.log("Not the enter key");
            }}
            onChange={(e) => {
              setTxt(e.target.value);
              setMessage({
                message: e.target.value,
                sender_id: user?.data.user?.id,
                time: new Date().toISOString().slice(0, 19).replace("T", " "),
                sender_image: sender_image,
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
          className="flex h-full w-1/12 items-center justify-center border-gray-700 bg-light_gray"
        >
          <Send
            size={30}
            color="#e5e7eb"
            className="mb-auto ml-4 mr-4 mt-auto"
          />
        </div>
      </div>
    </div>
  );
}

interface MessageCardProps {
  text: string;
  image_url?: string;
  sender_name: string;
  sender_id: string;
  sender_image: string;
  timestamp: string;
  right: boolean;
}

function MessageCard({
  text,
  image_url,
  sender_name,
  sender_id,
  sender_image,
  timestamp,
  right,
}: MessageCardProps) {
  return <div className="rounded-xl p-2">{text}</div>;
}

export default OpenChat;
