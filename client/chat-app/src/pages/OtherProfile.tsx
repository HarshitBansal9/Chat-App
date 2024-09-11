import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import dataFetch from "../axios";

function OtherProfile() {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [info, setInfo] = useState<any>([]);
  const [otherUserDet, setOtherUserDet] = useState<any>([]);
  useEffect(() => {
    async function getUserDetails() {
      console.log("getting user detials");
      const userDetails = await dataFetch.get("/profile/getuserdetails", {
        params: { id: id },
      });
      console.log("Useer Detilas", userDetails.data);
      console.log("picture", userDetails.data[0].raw_user_meta_data.avatar_url);
      setOtherUserDet(userDetails.data[0]);
    }
    getUserDetails();
    async function getDetails() {
      const userDetails = await dataFetch.get("/friends/getdetails", {
        params: { id: id },
      });
      setInfo(userDetails.data);
      console.log("User Details", userDetails.data);
    }
    getDetails();
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
        <div className="h-2/3 w-full text-md p-2 font-varela text-gray-100 font-bold">
            Description:
        </div>
        <div className="flex w-full flex-row gap-2">
          <div className="text-md ml-2 mr-2 flex w-1/2 items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400">
            Follow
          </div>
          <div className="text-md ml-2 mr-2 flex w-1/2 items-center justify-center rounded-lg bg-gray-500 pb-2 pl-4 pr-4 pt-2 font-varela font-bold text-navbar_background hover:cursor-pointer hover:bg-gray-400">
            Chat
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherProfile;
