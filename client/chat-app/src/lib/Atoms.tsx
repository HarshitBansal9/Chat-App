import { atom } from 'jotai';
import { Socket } from 'socket.io-client';
export const currentChats = atom<any>(null);
export const userInfo = atom<any>(undefined);
export const showFriendsList = atom(false);
export const selectedChoice = atom<string>("friends");
export const openedChat = atom<Chat | null>(null);
export const globalSocket = atom<Socket | null>(null);
export const userDetails = atom<any>(undefined);
interface Chat {
    chat_id:string,
    isGroup:boolean,
    name:string,
    image:string,
}
