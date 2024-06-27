import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:3001");
import { createClient } from "@supabase/supabase-js";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6amF1dWNpeXB5d3l5cnlyY3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzODQxNjQsImV4cCI6MjAzNDk2MDE2NH0.U0W-gzxacfecnN3ZlW4KYGeLfKfu1k5ku2zkdap5oas";
const SUPABASE_URL = "https://wzjauuciypywyyryrcvt.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const { data: { user } } = await supabase.auth.getUser()
console.log(user);  
function Messages() {
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
    <div>
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
