import { useAtom } from "jotai";
import { selectedChoice, showFriendsList } from "../lib/Atoms";
import { Heart, X } from "lucide-react";
import { useState } from "react";

interface Friend {
  id: number;
  username: string;
  auth_user_id: string;
  image_url: string;
  user1_id?: string;
  user2_id?: string;
  accepted?: boolean;
}

interface Request {
  id: number;
  username: string;
  auth_user_id: string;
  image_url: string;
  user1_id?: string;
  user2_id?: string;
  accepted?: boolean;
}

interface FriendsListProps {
  friendsArray: Friend[];
  requestsArray: Request[];
}
function FriendsList({ friendsArray, requestsArray }: FriendsListProps) {
  const [show, setShow] = useAtom(showFriendsList);
  const [selected, setSelected] = useAtom(selectedChoice);
  console.log(friendsArray);
  console.log(requestsArray);
  return (
    <div className="h-screen w-screen fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
      <div className="w-1/2 h-fit p-4 bg-custom_background rounded-lg shadow-xl flex flex-col mx-auto my-auto">
        <div className="w-full flex flex-row items-center justify-center border-b-[1px] border-light_gray pb-3">
          <div className="flex flex-row h-full flex items-center">
            <div
              onClick={() => {
                setSelected("friends");
              }}
              className={`text-gray-100 font-varela  pr-2 border-r-[2px] border-light_gray hover:cursor-pointer hover:font-bold font-${
                selected === "friends" ? "bold" : "varela"
              } text-xl`}
            >
              Friends
            </div>
            <div
              onClick={() => {
                setSelected("requests");
              }}
              className={`text-gray-100 hover:cursor-pointer hover:font-bold font-${
                selected === "requests" ? "bold" : "varela"
              } font-varela text-xl pl-2`}
            >
              Requests
            </div>
          </div>
          <X
            className="ml-auto hover:cursor-pointer hover:brightness-150"
            color={"gray"}
            onClick={() => {
              setShow(!show);
            }}
          />
        </div>
        <div className="p-2 w-full h-fit flex flex-col">
          {selected === "friends" ? (
            friendsArray.length === 0 ? (
              <div className="font-varela text-gray-400 text-md">
                No friends yet.
              </div>
            ) : (
              friendsArray.map((friend) => {
                return (
                  <div
                    key={friend.auth_user_id}
                    className="w-full hover:bg-light_gray rounded-lg pl-2 pr-2 hover:cursor-pointer h-16 flex flex-row items-center justify-start gap-4"
                  >
                    <img
                      src={friend.image_url}
                      className="rounded-full w-12 h-12"
                    />
                    <div className="flex flex-col">
                      <p className="text-gray-100 font-varela font-bold text-lg">
                        {friend.username}
                      </p>
                    </div>
                    <button className="ml-auto text-gray-100 hover:border-[1px] border-gray-400 hover:brightness-150 bg-custom_background pl-2 pr-2 pt-1 pb-1 rounded-lg">
                      Chat
                    </button>
                  </div>
                );
              })
            )
          ) : requestsArray.length === 0 ? (
            <div className="font-varela text-gray-400 text-md">
              No requests yet.
            </div>
          ) : (
            requestsArray.map((request) => {
              return (
                <div
                  key={request.auth_user_id}
                  className="w-full hover:bg-light_gray rounded-lg pl-2 pr-2 hover:cursor-pointer h-16 flex flex-row items-center justify-start gap-4"
                >
                  <img
                    src={request.image_url}
                    className="rounded-full w-12 h-12"
                  />
                  <div className="flex flex-col">
                    <p className="text-gray-100 font-varela font-bold text-lg">
                      {request.username}
                    </p>
                  </div>
                  <button className="ml-auto text-gray-100 hover:border-[1px] border-gray-400 hover:brightness-150 bg-custom_background pl-2 pr-2 pt-1 pb-1 rounded-lg">
                    Accept
                  </button>
                  <button className="ml-2 text-gray-100 hover:border-[1px] border-gray-400 hover:brightness-150 bg-custom_background pl-2 pr-2 pt-1 pb-1 rounded-lg">
                    Reject
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
