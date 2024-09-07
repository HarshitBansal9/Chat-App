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
    <div className="fixed inset-0 flex h-screen w-screen items-center justify-center bg-opacity-30 backdrop-blur-sm">
      <div className="mx-auto my-auto flex h-fit w-1/2 flex-col rounded-lg bg-custom_background p-4 shadow-xl">
        <div className="flex w-full flex-row items-center justify-center border-b-[1px] border-light_gray pb-3">
          <div className="flex h-full flex-row items-center">
            <div
              onClick={() => {
                setSelected("friends");
              }}
              className={`border-r-[2px] border-light_gray pr-2 font-varela text-gray-100 hover:cursor-pointer hover:font-bold font-${
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
              } pl-2 font-varela text-xl`}
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
        <div className="flex h-fit w-full flex-col p-2">
          {selected === "friends" ? (
            friendsArray.length === 0 ? (
              <div className="text-md font-varela text-gray-400">
                No friends yet.
              </div>
            ) : (
              friendsArray.map((friend) => {
                return (
                  <div
                    key={friend.auth_user_id}
                    className="flex h-16 w-full flex-row items-center justify-start gap-4 rounded-lg pl-2 pr-2 hover:cursor-pointer hover:bg-light_gray"
                  >
                    <img
                      src={friend.image_url}
                      className="h-12 w-12 rounded-full"
                    />
                    <div className="flex flex-col">
                      <p className="font-varela text-lg font-bold text-gray-100">
                        {friend.username}
                      </p>
                    </div>
                    <button className="ml-auto rounded-lg border-gray-400 bg-custom_background pb-1 pl-2 pr-2 pt-1 text-gray-100 hover:border-[1px] hover:brightness-150">
                      Chat
                    </button>
                  </div>
                );
              })
            )
          ) : requestsArray.length === 0 ? (
            <div className="text-md font-varela text-gray-400">
              No requests yet.
            </div>
          ) : (
            requestsArray.map((request) => {
              return (
                <div
                  key={request.auth_user_id}
                  className="flex h-16 w-full flex-row items-center justify-start gap-4 rounded-lg pl-2 pr-2 hover:cursor-pointer hover:bg-light_gray"
                >
                  <img
                    src={request.image_url}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-varela text-lg font-bold text-gray-100">
                      {request.username}
                    </p>
                  </div>
                  <button className="ml-auto rounded-lg border-gray-400 bg-custom_background pb-1 pl-2 pr-2 pt-1 text-gray-100 hover:border-[1px] hover:brightness-150">
                    Accept
                  </button>
                  <button className="ml-2 rounded-lg border-gray-400 bg-custom_background pb-1 pl-2 pr-2 pt-1 text-gray-100 hover:border-[1px] hover:brightness-150">
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
