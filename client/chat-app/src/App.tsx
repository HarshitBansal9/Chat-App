import Messages from "./pages/Messages";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import "react-cmdk/dist/cmdk.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { atom, useAtom } from "jotai";
import config from "../config";
import { Session, UserResponse, createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import dataFetch from "./axios";
import { currentChats, userDetails, userInfo } from "./lib/Atoms";
import CommandPalette, {
  filterItems,
  renderJsonStructure,
  useHandleOpenCommandPalette,
} from "react-cmdk";
import {
  ArrowLeft,
  Contact,
  ListCheck,
  ListChecks,
  LogOut,
  MessageSquareMore,
  SendHorizonal,
  User,
  Users,
} from "lucide-react";
import OtherProfile from "./pages/OtherProfile";
const SUPABASE_KEY = config.SUPABASE_KEY || "";
const SUPABASE_URL = config.SUPABASE_URL || "";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const sessionAtom = atom<Session | null>(null);
export const userAtom = atom<UserResponse | null>(null);
export const supabaseAtom = atom(supabase);
function App() {
  //For Command pallette
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<string>("root");
  const [info, setInfo] = useAtom(userInfo);
  enum CommandPallettePage {
    root = "root",
    friends = "friends",
    requests = "requests",
    users = "users",
    sentRequests = "sent requests",
  }

  const backObject = {
    heading: "Back",
    id: "back",
    items: [
      {
        children: "Back",
        id: "back",
        icon: ArrowLeft,
        closeOnSelect: false,
        onClick: () => {
          setPage(CommandPallettePage.root);
        },
      },
    ],
  };

  const rootItems = filterItems(
    [
      {
        heading: "Pages",
        id: "pages",
        items: [
          {
            children: "Messages",
            id: "messages",
            icon: MessageSquareMore,
            onClick: () => {navigate("/");},
          },
          {
            children: "Profile",
            id: "profile",
            icon: User,
            onClick: () => {navigate("/profile");},
          },
          {
            children: "LogOut",
            id: "logout",
            icon: LogOut,
          },
        ],
      },
      {
        heading: " User Details",
        id: "details",
        items: [
          {
            children: "Users",
            id: "users",
            icon: Users,
            closeOnSelect: false,
            onClick: () => {
              setPage(CommandPallettePage.users);
            },
          },
          {
            children: "Friends",
            id: "friends",
            icon: Contact,
            closeOnSelect: false,
            onClick: () => {
              setPage(CommandPallettePage.friends);
            },
          },
          {
            children: "Requests",
            id: "requests",
            icon: ListChecks,
            closeOnSelect: false,
            onClick: () => {
              setPage(CommandPallettePage.requests);
            },
          },
          {
            children: "Sent Requests",
            id: "sent_requests",
            icon: SendHorizonal,
            closeOnSelect: false,
            onClick: () => {
              setPage(CommandPallettePage.sentRequests);
            },
          },
        ],
      },
    ],
    search,
  );
  //all Friends
  const [friendItems, setFriendItems] = useState([backObject]);
  //all  received Requests
  const [receivedRequestItems, setReceivedRequestItems] = useState([
    backObject,
  ]);
  //all users
  const [userItems, setUserItems] = useState([backObject]);
  //all sent requests
  const [sentRequestItems, setSentRequestItems] = useState([backObject]);
  const [session, setSession] = useAtom(sessionAtom);
  const [user, setUser] = useAtom(userAtom);
  //const [chats, setChats] = useAtom(currentChats);
  const navigate = useNavigate();
  useEffect(() => {
    async function getUserDetails() {
      if (info === null || info === undefined) {
        const userDetails = await dataFetch.get("/friends/getdetails");
        console.log("User Details", userDetails.data);

        //For friends
        setFriendItems([
          backObject,
          {
            heading: "Friends",
            id: "friends",
            items: userDetails.data.allFriends.map((friend: any) => {
              return {
                children: friend.username,
                id: friend.auth_user_id,
                icon: User,
                onClick: () => {
                  navigate(`/other/${friend.auth_user_id}`);
                },
              };
            }),
          },
        ]);

        //For received requests
        setReceivedRequestItems([
          backObject,
          {
            heading: "Requests",
            id: "requests",
            items: userDetails.data.allRequests.map((request: any) => {
              return {
                children: request.username,
                id: request.auth_user_id,
                icon: User,
                onClick: () => {
                  navigate(`/other/${request.auth_user_id}`);
                },
              };
            }),
          },
        ]);

        // for users
        setUserItems([
          backObject,
          {
            heading: "Users",
            id: "users",
            items: userDetails.data.allMembers.map((member: any) => {
              return {
                children: member.username,
                id: member.auth_user_id,
                icon: User,
                onClick: () => {
                  navigate(`/other/${member.auth_user_id}`);
                },
              };
            }),
          },
        ]);

        //for sent requests
        setSentRequestItems([
          backObject,
          {
            heading: "Sent Requests",
            id: "sent_requests",
            items: userDetails.data.sentRequests.map((request: any) => {
              return {
                children: request.username,
                id: request.auth_user_id,
                icon: User,
                onClick: () => {
                  navigate(`/other/${request.auth_user_id}`);
                },
              };
            }),
          },
        ]);

        setInfo(userDetails.data);
      }
    }
    if (session != null && user != null) {
      getUserDetails();
    }
  }, [session, user]);
  useEffect(() => {
    async function getSession() {
      const session = await supabase.auth.getSession();
      dataFetch.defaults.headers.jwt_token =
        session?.data.session?.access_token || "";
      console.log(String(dataFetch.defaults.headers.Authorization).length);
      if (
        dataFetch.defaults.headers.Authorization != null &&
        String(dataFetch.defaults.headers.Authorization).split(" ")[1] === ""
      ) {
        dataFetch.defaults.headers.Authorization +=
          session?.data.session?.access_token || "";
      }
      setSession(session.data.session);
    }
    async function getUser() {
      const user = await supabase.auth.getUser();
      console.log("User", user);
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

  useHandleOpenCommandPalette(setIsOpen);

  //<input autocomplete="off" role="combobox" spellcheck="false" aria-expanded="true" aria-controls="kbar-listbox" aria-activedescendant="kbar-listbox-item-7" placeholder="Type a command or search…" value="" style="padding: 12px 16px; font-size: 16px; width: 100%; box-sizing: border-box; outline: none; border: none; background: var(--background); color: var(--foreground);">
  return (
    <>
      <CommandPalette
        search={search}
        isOpen={isOpen}
        onChangeOpen={setIsOpen}
        onChangeSearch={setSearch}
        page={page}
      >
        <CommandPalette.Page id={CommandPallettePage.root}>
          {renderJsonStructure(rootItems)}
        </CommandPalette.Page>
        <CommandPalette.Page
          id={CommandPallettePage.friends}
          onEscape={() => {
            setPage(CommandPallettePage.root);
          }}
          searchPrefix={["Friends"]}
        >
          {renderJsonStructure(
            info != undefined && info != null ? friendItems : [],
          )}
        </CommandPalette.Page>
        <CommandPalette.Page
          id={CommandPallettePage.requests}
          onEscape={() => {
            setPage(CommandPallettePage.root);
          }}
          searchPrefix={["Requests"]}
        >
          {renderJsonStructure(
            info != undefined && info != null ? receivedRequestItems : [],
          )}
        </CommandPalette.Page>
        <CommandPalette.Page
          id={CommandPallettePage.users}
          onEscape={() => {
            setPage(CommandPallettePage.root);
          }}
          searchPrefix={["Users"]}
        >
          {renderJsonStructure(
            info != undefined && info != null ? userItems : [],
          )}
        </CommandPalette.Page>
        <CommandPalette.Page
          id={CommandPallettePage.sentRequests}
          onEscape={() => {
            setPage(CommandPallettePage.root);
          }}
          searchPrefix={["Sent Requests"]}
        >
          {renderJsonStructure(
            info != undefined && info != null ? sentRequestItems : [],
          )}
        </CommandPalette.Page>
      </CommandPalette>
        <div className="flex flex-row">
          <Navbar />
          <Routes>
            {session != null ? (
              <>
                <Route path="/" element={<Messages />} />
                <Route path="/friends" element={<Friends />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/other/:id" element={<OtherProfile />} />
              </>
            ) : (
              <Route path="/login" element={<Login />} />
            )}
          </Routes>
        </div>
    
    </>
  );
}

export default App;
