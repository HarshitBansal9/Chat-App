import { useAtom } from "jotai";
import React, { useInsertionEffect, useState } from "react";
import { Contact, MessageCircle, Handshake } from "lucide-react";
import dataFetch from "../axios";
import { useEffect } from "react";
import {
  userInfo,
  showFriendsList,
  userDetails,
  selectedChoice,
} from "../lib/Atoms";
import FriendsList from "../components/FriendsList";

function Profile() {
  const [userDet, setUserDet] = useAtom(userDetails);
  const [info, setInfo] = useAtom(userInfo);
  const [show, setShow] = useAtom(showFriendsList);
  const [selected, setSelected] = useAtom(selectedChoice);
  useEffect(() => {
    async function getUserDetails() {
      console.log("getting user detials");
      const userDetails = await dataFetch.get("/profile/getuserdetails");
      console.log("Useer Detilas", userDetails.data);
      console.log("picture", userDetails.data[0].raw_user_meta_data.avatar_url);
      setUserDet(userDetails.data[0]);
    }

    async function getDetails() {
      const userDetails = await dataFetch.get("/friends/getdetails");
      setInfo(userDetails.data);
      console.log("User Details", userDetails.data);
    }
    getDetails();
    getUserDetails();
  }, []);
  return (
    <div className="relative z-0 flex w-5/6 flex-col bg-custom_background">
      {show && (
        <FriendsList
          friendsArray={info?.allFriends}
          requestsArray={info.allRequests}
        />
      )}
      <div className="flex h-2/3 w-full flex-row p-4">
        <div className="flex h-full w-1/3 flex-col rounded-lg bg-light_gray">
          <div className="flex h-1/4 flex-row p-2">
            <img
              src={userDet?.raw_user_meta_data?.avatar_url}
              className="rounded-full"
            />
            <div className="flex h-1/3 w-full flex-col p-2 pl-6 pt-4">
              <p className="font-varela text-2xl font-bold text-gray-100">
                {userDet?.username}
              </p>
              <p className="font-varela text-lg text-gray-400">
                {userDet?.email}
              </p>
              <div className="flex flex-row items-center gap-2 pt-3">
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
                <p className="text-md font-varela text-green-400">Online</p>
              </div>
            </div>
          </div>
          <div className="flex h-1/3 w-full flex-col items-center justify-center p-2">
            <div
              onClick={() => {
                setShow(!show);
                setSelected("friends");
              }}
              className="mb-2 flex w-full flex-row items-center gap-4 pl-7 font-varela text-xl text-gray-400 hover:cursor-pointer hover:brightness-150"
            >
              <Contact size={30} />
              <p>{info?.allFriends.length} friend</p>
            </div>
            <div className="mb-2 flex w-full flex-row items-center gap-4 pl-7 font-varela text-xl text-gray-400">
              <MessageCircle size={30} />
              <p>567 Chats</p>
            </div>
            <div
              onClick={() => {
                setShow(!show);
                setSelected("requests");
              }}
              className="mb-2 flex w-full flex-row items-center gap-4 pl-7 font-varela text-xl text-gray-400 hover:cursor-pointer hover:brightness-150"
            >
              <Handshake size={30} />
              <p>{info?.allRequests.length} Requests</p>
            </div>
            <p className="text-md font-varela text-gray-400">
              Hey There! I am using Chat App
            </p>
          </div>
          <div className="mt-auto flex w-full justify-center pb-4">
            <div className="text-navbar_backkground flex w-5/6 items-center justify-center rounded-lg bg-gray-500 p-3 font-varela text-lg hover:cursor-pointer hover:bg-gray-400">
              Edit Profile
            </div>
          </div>
        </div>
        <div className="ml-2 h-full w-2/3 rounded-lg bg-light_gray"></div>
      </div>
    </div>
  );
}

export default Profile;
