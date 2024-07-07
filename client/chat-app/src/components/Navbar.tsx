import {Bot,MessageSquareMore,Contact,Settings,LogOut,User} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAtom } from "jotai";
import { sessionAtom, supabaseAtom } from "../App";
const navbarLinksTop = [
    {
        name: 'Messages',
        icon: <MessageSquareMore  color="rgb(156 163 175)"/>,
        to: '/',
        auth:true
    },
    {
        name: 'Friends',
        icon: <Contact  color="rgb(156 163 175)"/>,
        to: '/friends',
        auth:true
    },
    {
        name: 'Profile',
        icon: <User  color="rgb(156 163 175)"/>,
        to: '/profile',
        auth:true
    }
]
const navbarLinksBottom = [
    {
        name: 'Settings',
        icon: <Settings  color="rgb(156 163 175)"/>,
        to: '/settings',
        auth:true
    },
    {
        name: 'Logout',
        icon: <LogOut  color="rgb(156 163 175)"/>,
        to: '/login'
    }

]
function Navbar() {
    const [session] = useAtom(sessionAtom)
    const location = useLocation();
    let path = location.pathname;
    if (path === '/') {
        path = '/messages';
    } else if (path === '/login') {
        path = '/logout';
    }
  return (
    <div className="bg-navbar_background h-[100vh] flex flex-col">
        <div className="w-full flex items-center  justify-center flex-row gap-4 pl-6 pr-6 pt-6 pb-8">
            <Bot color="white" size={44}></Bot>
            <div className="font-pixel text-3xl text-center text-gray-100">Chat App</div>
        </div>
        <div className='flex flex-col'>
            {navbarLinksTop.filter(link=>link.auth&&session!=null).map((link) =>{return (<Navbar_option selected={(path===('/'+link.name.toLowerCase()))?(true):false} key={link.to} to={link.to} icon={link.icon} children={<div className='text-2xl text-gray-400 font-pixel'>{link.name}</div>}></Navbar_option>)} )}
        </div>
        <div className='flex flex-col pt-10 mt-auto mb-4'>
            {navbarLinksBottom.map((link) =>{return (<Navbar_option selected={(path===('/'+link.name.toLowerCase()))?(true):false} key={link.to} to={link.to} icon={link.icon} children={<div className='text-2xl text-gray-400 font-pixel'>{link.name}</div>}></Navbar_option>)} )}
        </div>
    </div>

  );
}

type BoxProps = {
    icon: React.ReactNode;
    children: React.ReactNode;
    to:string
    selected:boolean
};  

function Navbar_option(props: BoxProps) {
    const [supabase] = useAtom(supabaseAtom);
    const navigate = useNavigate();
    return (
        <div onClick={()=>{
            if(props.to==='/login'){
                supabase.auth.signOut();
            }
            navigate(props.to)}} className='z-0 flex flex-row items-center relative'>
                {props.selected?(<div className='absolute top-0 left-0 z-10 bg-gradient-to-r from-violet-900 to-navbar_background w-6 h-full'></div>):(<div className='z-10'></div>)}
            <div className="flex relative items-center gap-4 brightness-110 hover:cursor-pointer hover:brightness-150 pl-8 pr-10 pt-4 pb-4">
                {props.icon}
                {props.children}
            </div>
        </div>
    )
}

export default Navbar;
