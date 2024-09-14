import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dataFetch from "../axios";
import { userDetails, userInfo } from "@/lib/Atoms";
import { useAtom } from "jotai";

function OtherProfile() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [isFriend, setIsFriend] = useState<any>(null);
  const [info,setInfo] = useAtom(userInfo);
  const [otherUserDet, setOtherUserDet] = useState<any>([]);

  async function sendFriendRequest(){
    const response = await dataFetch.post("/friends/sendrequest",{
      receiver: id
    });
    console.log("Response",response);
  }

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

    async function getCurrentUserDetails(){
      const userDetails = await dataFetch.get("/friends/getdetails");
      
      for (let i = 0; i < userDetails.data.allFriends.length; i++) {
        console.log("User Details", userDetails.data.allFriends[i].auth_user_id);
        if (userDetails.data.allFriends[i].auth_user_id === id) {
          console.log("User is a friend");
          setInfo(userDetails.data[0]);
          setIsFriend(true);
          return;
        }
      }
      setIsFriend(false);
    }
    if (info === null || info === undefined){
      console.log("Getting current user details");
      getCurrentUserDetails();
    }
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
          {((info != null || info != undefined) && isFriend != null )?(isFriend ? (
            <>
              <div className="text-md ml-2 mr-2 flex w-1/2 items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400">
                Unfollow
              </div>
              <div className="text-md ml-2 mr-2 flex w-1/2 items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400">
                Chat
              </div>
            </>
          ) : (
            <div onClick={()=>{sendFriendRequest()}} className="text-md ml-2 mr-2 flex w-full items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400">
              Send follow request
            </div>
          )):(<></>)}
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
