import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
import { useAtom } from "jotai";
import { supabaseAtom } from "../App";

function Messages() {
  const [supabase] = useAtom(supabaseAtom);
 // console.log(supabase.auth.getSession());
  const [receivedMessage, setReceivedMessage] = useState<string>("");
  const message = useRef("");
  function sendMessage(data: string) {
    socket.emit("send_message", { message: data });
  }
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessage(data.message);
    });
  }, []);
  return (
    <div className="bg-custom_background w-full">
      <input
        type="text"
        onChange={(e) => {
          message.current = e.target.value;
        }}
        placeholder="Enter message"
      />
      <button
        onClick={() => {
          sendMessage(message.current);
        }}
      >
        Send message
      </button>
      <p>{receivedMessage}</p>
    </div>
  );
}

export default Messages;
