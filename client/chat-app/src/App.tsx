import Messages from "./pages/Messages";
import Login from "./pages/Login";
import OpenChat from "./components/OpenChat";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { atom, useAtom } from "jotai";
import config from "../config";
import { Session, UserResponse, createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import dataFetch from "./axios";
import { currentChats, userDetails } from "./lib/Atoms";
const SUPABASE_KEY = config.SUPABASE_KEY || "";
const SUPABASE_URL = config.SUPABASE_URL || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const sessionAtom = atom<Session | null>(null);
export const userAtom = atom<UserResponse | null>(null);
export const supabaseAtom = atom(supabase);
function App() {
  const [session, setSession] = useAtom(sessionAtom);
  const [user, setUser] = useAtom(userAtom);
  //const [chats, setChats] = useAtom(currentChats);
  const [userDet,setUserDet] = useAtom(userDetails);
  useEffect(() => {
    async function getSession() {
      const session = await supabase.auth.getSession();
      dataFetch.defaults.headers.jwt_token =
        session?.data.session?.access_token || "";
      console.log(String(dataFetch.defaults.headers.Authorization).length); 
      if(dataFetch.defaults.headers.Authorization != null && String(dataFetch.defaults.headers.Authorization).split(' ')[1]===""){
        dataFetch.defaults.headers.Authorization += session?.data.session?.access_token || "";
      }
      setSession(session.data.session);
    }
    async function getUser() {
      const user = await supabase.auth.getUser();
      console.log(user);
      setUser(user);
    }
    if (!user) {
      console.log("U", user);
      getUser();
    }

    if (!session) {
      getSession();
    }
  }, []);
  return (
    <BrowserRouter>
      <div className="flex flex-row">
        <Navbar />
        <Routes>
          {session != null ? (
            <>
              <Route path="/" element={<Messages />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </>
          ) : (
            <Route path="/login" element={<Login />} />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
