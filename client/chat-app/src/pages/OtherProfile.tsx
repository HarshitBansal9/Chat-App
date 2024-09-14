import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dataFetch from "../axios";
import { currentChats, userDetails, userInfo } from "@/lib/Atoms";
import { useAtom } from "jotai";
import { get } from "http";

function OtherProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [isFriend, setIsFriend] = useState<any>(null);
  const [info, setInfo] = useAtom(userInfo);
  const [isUserInChat,setIsUserInChat] = useState<any>(false);
  const [chats, setChats] = useAtom(currentChats);
  const [otherUserDet, setOtherUserDet] = useState<any>([]);
  useEffect(() => {
    async function getChats(){
      if (chats === null || chats === undefined) {
        const chats = await dataFetch.get("/chats/getchatsnew");
        console.log("Chats New", chats);
        Object.keys(chats.data).forEach((chat:any) => {
          console.log("Chat", chat);
          if (
            chats.data[chat].is_group === false &&
            (chats.data[chat].participants[0].user_id === id ||
              chats.data[chat].participants[1].user_id === id)
          ) {
            console.log("User is in chat");
            setIsUserInChat(true);
          }
        });
        setIsUserInChat(false);
    }
    Object.keys(chats).forEach((chat) => {
      if (
        chats[chat].is_group === false &&
        (chats[chat].participants[0].user_id === id ||
          chats[chat].participants[1].user_id === id)
      ) {
        setIsUserInChat(true);
      }
    });
    setIsUserInChat(false);
    }
    getChats();
  },[chats])


  async function createChat() {
    console.log("is other user in chat", isUserInChat);
    if (await isUserInChat) {
      navigate("/messages");
      return;
    }
    const response = await dataFetch.post("/chat/createchat", {
      user: id,
      isGroup: false,
      chatName: null,
    });
    navigate("/messages");
    console.log("Response", response);
  }
  async function sendFriendRequest() {
    const response = await dataFetch.post("/friends/sendrequest", {
      receiver: id,
    });
    console.log("Response", response);
  }
  const removeFriend = useCallback(async () => {
    const response = await dataFetch.post("/friends/removefriend", {
      receiver: id,
    });
    return response;
  }, [id]);

  useEffect(() => {
    async function getUserDetails() {
      const userDetails = await dataFetch.get("/profile/getuserdetails", {
        params: { id: id },
      });
      setOtherUserDet(userDetails.data[0]);
    }
    getUserDetails();

    // async function getDetails() {
    //   const userDetails = await dataFetch.get("/friends/getdetails", {
    //     params: { id: id },
    //   });
    //   for (let i = 0; i < userDetails.data.allFriends.length; i++) {
    //     console.log("User Details", userDetails.data.allFriends[i].auth_user_id);
    //     if (userDetails.data.allFriends[i].auth_user_id === id) {
    //       console.log("User is a friend");
    //       setIsFriend(true);
    //       return;
    //     }
    //   }
    //   setIsFriend(false);
    // }
    // getDetails();

    async function getCurrentUserDetails() {
      const userDetails = await dataFetch.get("/friends/getdetails");
      for (let i = 0; i < userDetails.data.allFriends.length; i++) {
        if (userDetails.data.allFriends[i].auth_user_id === id) {
          setInfo(userDetails.data);
          setIsFriend(true);
          return;
        }
      }
      setIsFriend(false);
    }
    getCurrentUserDetails();
  }, []);
  return (
    <div className="flex w-5/6 justify-center bg-custom_background">
      <div className="mt-6 flex h-2/3 w-2/5 flex-col rounded-lg bg-light_gray shadow-xl">
        <div className="flex h-1/4 flex-row p-2">
          <img
            src={otherUserDet?.raw_user_meta_data?.avatar_url}
            className="rounded-full"
          />
          <div className="flex h-1/3 w-full flex-col p-2 pl-6 pt-4">
            <p className="font-varela text-2xl font-bold text-gray-100">
              {otherUserDet?.username}
            </p>
            <p className="font-varela text-lg text-gray-400">
              {otherUserDet?.email}
            </p>
            <div className="flex flex-row items-center gap-2 pt-3">
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <p className="text-md font-varela text-green-400">Online</p>
            </div>
          </div>
        </div>
        <div className="text-md h-2/3 w-full p-2 font-varela font-bold text-gray-100">
          Description:
        </div>
        <div className="flex w-full flex-row gap-2">
          {info != null && info != undefined && isFriend != null ? (
            isFriend ? (
              <>
                <div
                  onClick={() => {
                    removeFriend();
                  }}
                  className="text-md ml-2 mr-2 flex w-1/2 items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400"
                >
                  Unfollow
                </div>
                <div
                  onClick={() => {
                    createChat();
                  }}
                  className="text-md ml-2 mr-2 flex w-1/2 items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400"
                >
                  Chat
                </div>
              </>
            ) : (
              <div
                onClick={() => {
                  sendFriendRequest();
                }}
                className="text-md ml-2 mr-2 flex w-full items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400"
              >
                Send follow request
              </div>
            )
          ) : (
            <div>Loading</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
