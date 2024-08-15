import { useAtom } from "jotai";
import React, { useInsertionEffect } from "react";
import { Contact,MessageCircle,Handshake } from "lucide-react";
import dataFetch from "../axios";
import { useEffect } from "react";
import { currentFriends, userDetails } from "../lib/Atoms";

function Profile() {
  const [userDet, setUserDet] = useAtom(userDetails);
  const [friends,setFriends] = useAtom(currentFriends)
  useEffect(() => {
    async function getUserDetails() {
      console.log("getting user detials");
      const userDetails = await dataFetch.get("/profile/getuserdetails");
      console.log("Useer Detilas", userDetails.data);
      console.log("picture", userDetails.data[0].raw_user_meta_data.avatar_url);
      setUserDet(userDetails.data[0]);
    }

    async function getDetails(){
      const userDetails = await dataFetch.get("/friends/getdetails");
      setFriends(userDetails.data.allFriends);
      console.log("User Details", userDetails.data);
    }    
    getDetails();
    getUserDetails();
  }, []);
  return (
    <div className="bg-custom_background w-5/6 flex flex-col">
      <div className="w-full flex flex-row p-4 h-2/3">
        <div className="bg-light_gray h-full w-1/3 rounded-lg flex flex-col">
          <div className="h-1/4 flex flex-row p-2">
            <img
              src={userDet?.raw_user_meta_data?.avatar_url}
              className="rounded-full"
            />
            <div className="w-full h-1/3 pl-6 pt-4 flex flex-col p-2">
              <p className="font-varela text-gray-100 font-bold text-2xl">{userDet?.username}</p>
              <p className="font-varela text-lg text-gray-400">{userDet?.email}</p>
              <div className="flex flex-row gap-2 pt-3 items-center"><div className="rounded-full bg-green-400 w-3 h-3"></div><p className="text-green-400 text-md font-varela">Online</p></div>
            </div>
          </div>
          <div className="h-1/3 p-2 flex flex-col w-full items-center justify-center">
            <div className="flex flex-row items-center w-full font-varela mb-2 text-xl text-gray-400 pl-7 gap-4"><Contact size={30}/><p>{friends.length} friend</p></div>
            <div className="flex flex-row items-center w-full font-varela mb-2 text-xl text-gray-400 pl-7 gap-4"><MessageCircle size={30}/><p>567 Chats</p></div>
            <div className="flex flex-row items-center w-full font-varela mb-2 text-xl text-gray-400 pl-7 gap-4"><Handshake size={30}/><p>75 Requests</p></div>
            <p className="text-md font-varela text-gray-400">Hey There! I am using Chat App</p>
          </div>
          <div className="mt-auto w-full pb-4 flex justify-center"><div className="w-5/6 p-3 rounded-lg bg-gray-500 flex justify-center items-center font-varela text-lg hover:cursor-pointer hover:bg-gray-400 text-navbar_backkground">Edit Profile</div></div>
        </div>
        <div className="bg-light_gray h-full w-2/3 ml-2 rounded-lg"></div>
      </div>
    </div>
  );
}

export default Profile;
