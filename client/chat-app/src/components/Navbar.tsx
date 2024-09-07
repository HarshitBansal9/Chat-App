import {
  Bot,
  MessageSquareMore,
  Contact,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { sessionAtom, supabaseAtom } from "../App";
const navbarLinksTop = [
  {
    name: "Messages",
    icon: <MessageSquareMore color="rgb(156 163 175)" />,
    to: "/",
    auth: true,
  },
  {
    name: "Friends",
    icon: <Contact color="rgb(156 163 175)" />,
    to: "/friends",
    auth: true,
  },
  {
    name: "Profile",
    icon: <User color="rgb(156 163 175)" />,
    to: "/profile",
    auth: true,
  },
];
const navbarLinksBottom = [
  {
    name: "Settings",
    icon: <Settings color="rgb(156 163 175)" />,
    to: "/settings",
    auth: true,
  },
  {
    name: "Logout",
    icon: <LogOut color="rgb(156 163 175)" />,
    to: "/login",
  },
];
function Navbar() {
  const [session] = useAtom(sessionAtom);
  const location = useLocation();
  let path = location.pathname;
  if (path === "/") {
    path = "/messages";
  } else if (path === "/login") {
    path = "/logout";
  }
  return (
    <div className="flex h-[100dvh] w-1/6 flex-col bg-navbar_background p-2">
      <div className="flex w-full flex-row items-center justify-center gap-4 pb-8 pl-6 pr-6 pt-6">
        <Bot color="white" size={40}></Bot>
        <div className="text-center font-varela text-3xl text-gray-100">
          Chat App
        </div>
      </div>
      <div className="flex flex-col">
        {navbarLinksTop
          .filter((link) => link.auth && session != null)
          .map((link) => {
            return (
              <Navbar_option
                selected={path === "/" + link.name.toLowerCase() ? true : false}
                key={link.to}
                to={link.to}
                icon={link.icon}
                children={
                  <div className="font-varela text-xl text-gray-400">
                    {link.name}
                  </div>
                }
              ></Navbar_option>
            );
          })}
      </div>
      <div className="mb-4 mt-auto flex flex-col pt-10">
        {navbarLinksBottom.map((link) => {
          return (
            <Navbar_option
              selected={path === "/" + link.name.toLowerCase() ? true : false}
              key={link.to}
              to={link.to}
              icon={link.icon}
              children={
                <div className="font-varela text-xl text-gray-400">
                  {link.name}
                </div>
              }
            ></Navbar_option>
          );
        })}
      </div>
    </div>
  );
}

type BoxProps = {
  icon: React.ReactNode;
  children: React.ReactNode;
  to: string;
  selected: boolean;
};

function Navbar_option(props: BoxProps) {
  const [supabase] = useAtom(supabaseAtom);
  const [session, setSession] = useAtom(sessionAtom);
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        if (props.to === "/login") {
          supabase.auth.signOut();
          setSession(null);
        }
        navigate(props.to);
      }}
      className="relative z-0 flex flex-row items-center"
    >
      {props.selected ? (
        <div className="absolute left-0 top-0 z-10 h-full w-1 bg-gradient-to-b from-violet-900 to-gray-200"></div>
      ) : (
        <div className="z-10"></div>
      )}
      <div className="relative flex items-center gap-4 pb-4 pl-8 pr-10 pt-4 brightness-110 hover:cursor-pointer hover:brightness-150">
        {props.icon}
        {props.children}
      </div>
    </div>
  );
}

export default Navbar;
