import { atom } from 'jotai';
import { Socket } from 'socket.io-client';
export const currentFriends = atom([]);
export const currentRequests = atom([]);
export const currentChats = atom([]);
export const currentMembers = atom([]);
export const currentSentRequests = atom([]);   
export const openedChat = atom<Chat | null>(null);
export const globalSocket = atom<Socket | null>(null);
interface Chat {
    chat_id:string,
    isGroup:boolean,
    name:string,
    image:string,
}