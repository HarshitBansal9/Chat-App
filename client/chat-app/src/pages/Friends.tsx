// import { useAtom } from "jotai";
// import {
//   currentFriends,
//   currentSentRequests,
//   currentMembers,
//   currentRequests,
// } from "../lib/Atoms";
// import { userAtom } from "../App";
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import dataFetch from "../axios";
function Friends() {
    return <div></div>
//   const [requests, setRequests] = useAtom(currentRequests);
//   const [members, setMembers] = useAtom(currentMembers);
//   const [sentRequests, setSentRequests] = useAtom(currentSentRequests);
//   const [friends, setFriends] = useAtom(currentFriends);
//   useEffect(() => {
//     async function getDetails() {
//       const details = await dataFetch.get("/friends/getdetails");
//       setSentRequests(details.data.sentRequests);
//       setMembers(details.data.allMembers);
//       setRequests(details.data.allRequests);
//       setFriends(details.data.allFriends);
//     }
//     getDetails();
//   }, []);
//   return (
//     <div className="bg-custom_background w-5/6 flex flex-col">
//       <div className="friends flex flex-col">
//         <div className="w-full font-varela text-gray-200 text-2xl p-4">
//           Friends
//         </div>
//         {friends.length === 0 ? (
//           <div className="font-varela text-stone-500 text-lg pl-4 pt-2">
//             No current friends
//           </div>
//         ) : (
//           <div className="font-varela text-lg pl-4 pt-2 flex flex-row">
//             {friends.map((friend: any) => {
//               return (
//                 <FriendCard
//                   key={friend.id}
//                   username={friend.username}
//                   id={friend.auth_user_id}
//                 ></FriendCard>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <div className="friends flex flex-col">
//         <div className="w-full font-varela text-gray-200 text-2xl p-4">
//           Current Requests
//         </div>
//         {requests.length === 0 ? (
//           <div className="font-varela text-stone-500 text-lg pl-4 pt-2">
//             No current requests
//           </div>
//         ) : (
//           <div className="font-varela text-lg pl-4 pt-2 flex flex-row">
//             {requests.map((request: any) => {
//               return (
//                 <RequestCard
//                   key={request.id}
//                   username={request.username}
//                   id={request.user1_id}
//                 ></RequestCard>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <div className="friends flex flex-col">
//         <div className="w-full font-varela text-gray-200 text-2xl p-4">
//           Other Members
//         </div>
//         {members.length === 0 ? (
//           <div className="font-varela text-stone-500 text-lg pl-4 pt-2">
//             No current members
//           </div>
//         ) : (
//           <div className="font-varela text-lg pl-4 pt-2 flex flex-row">
//             {members.map((member: any) => {
//               return (
//                 <MemberCard
//                   key={member.id}
//                   username={member.username}
//                   id={member.auth_user_id}
//                 ></MemberCard>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <div className="friends flex flex-col">
//         <div className="w-full font-varela text-gray-200 text-2xl p-4">
//           Sent Requests
//         </div>
//         {sentRequests.length === 0 ? (
//           <div className="font-varela text-stone-500 text-lg pl-4 pt-2">
//             No requests sent
//           </div>
//         ) : (
//           <div className="font-varela text-lg pl-4 pt-2 flex flex-row">
//             {sentRequests.map((request: any) => {
//               return (
//                 <SentRequestCard
//                   key={request.id}
//                   username={request.username}
//                   id={request.auth_user_id}
//                 ></SentRequestCard>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
}
// interface MemberCardProps {
//   username: string;
//   id: string;
// }
// function RequestCard(props: MemberCardProps) {
//   const [user] = useAtom(userAtom);
//   const [allMembers, setAllMembers]: any = useAtom(currentMembers);
//   const [requests, setRequests] = useAtom(currentRequests);
//   const [friends, setFriends]: any = useAtom(currentFriends);
//   function handleRequest(action: string) {
//     try {Pron === "accept") {
//         const newFriend = {
//           id: friends.length > 0 ? friends[friends.length - 1].id + 1 : 1,
//           username: props.username,
//           auth_user_id: props.id,
//         };
//         console.log(newFriend);
//         setFriends([...friends, newFriend]);
//         const newRequests = requests.filter((request: any) => {
//           return request.auth_user_id != props.id;
//         });
//         setRequests(newRequests);
//       } else if (action === "reject") {
//         const newMember = {
//           id:
//             allMembers.length > 0
//               ? allMembers[allMembers.length - 1].id + 1
//               : 1,
//           username: props.username,
//           auth_user_id: props.id,
//         };
//         setAllMembers([...allMembers, newMember]);
//         const newRequests = requests.filter((request: any) => {
//           return request.auth_user_id != props.id;
//         });
//         setRequests(newRequests);
//       }
//       dataFetch.post("/friends/handleRequest", null, {
//         params: {
//           action: action,
//           sender: props.id,
//           receiver: user?.data.user?.id,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return (
//     <div className="flex flex-col p-6 border-2 rounded-lg border-gray-500">
//       <div className="text-gray-200 pb-4">{props.username}</div>
//       <button
//         onClick={() => {
//           handleRequest("accept");
//         }}
//         className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background"
//       >
//         Accept Request
//       </button>
//       <button
//         onClick={() => {
//           handleRequest("reject");
//         }}
//         className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background"
//       >
//         Reject Request
//       </button>
//     </div>
//   );
// }
// function MemberCard(props: MemberCardProps) {
//   const [user] = useAtom(userAtom);
//   const [allMembers, setAllMembers]: any = useAtom(currentMembers);
//   const [sentRequests, setSentRequests]: any = useAtom(currentSentRequests);
//   function sendRequest() {
//     try {
//       dataFetch.post("/friends/sendrequest", null, {
//         params: { sender: user?.data.user?.id, receiver: props.id },
//       });
//       const newMembers = allMembers.filter((member: any) => {
//         return member.auth_user_id != props.id;
//       });
//       setAllMembers(newMembers);
//       const newRequest = {
//         id:
//           sentRequests.length > 0
//             ? sentRequests[sentRequests.length - 1].id + 1
//             : 1,
//         username: props.username,
//         auth_user_id: props.id,
//         user1_id: user?.data.user?.id,
//         user2_id: props.id,
//       };
//       setSentRequests([...sentRequests, newRequest]);
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return (
//     <div className="flex flex-col p-6 border-2 rounded-lg border-gray-500">
//       <div className="text-gray-200 pb-4">{props.username}</div>
//       <button
//         onClick={() => {
//           sendRequest();
//         }}
//         className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background"
//       >
//         Send Request
//       </button>
//     </div>
//   );
// }

// function FriendCard(props: MemberCardProps) {
//   const navigate = useNavigate();
//   const [allMembers, setAllMembers]: any = useAtom(currentMembers);
//   const [friends, setFriends]: any = useAtom(currentFriends);
//   function removeFriend() {
//     try {
//       dataFetch.post("/friends/removefriend", null, {
//         params: { sender: props.id },
//       });
//       const newFriends = friends.filter((friend: any) => {
//         return friend.auth_user_id != props.id;
//       });
//       setFriends(newFriends);
//       const newMember = {
//         id:
//           allMembers.length > 0 ? allMembers[allMembers.length - 1].id + 1 : 1,
//         username: props.username,
//         auth_user_id: props.id,
//       };
//       setAllMembers([...allMembers, newMember]);
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   function createChat() {
//     try {
//       navigate("/");
//       dataFetch.post("/chats/createChat", null, {
//         params: { isGroup: false, chatName: null, user: props.id },
//       });
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return (
//     <div className="flex flex-col p-6 border-2 rounded-lg border-gray-500">
//       <div className="text-gray-200 pb-4">{props.username}</div>
//       <div>
//         <button
//           onClick={() => {
//             createChat();
//           }}
//           className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background"
//         >
//           Chat
//         </button>
//         <button
//           onClick={() => {
//             removeFriend();
//           }}
//           className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background"
//         >
//           Remove Friend
//         </button>
//       </div>
//     </div>
//   );
// }

// function SentRequestCard(props: MemberCardProps) {
//   const [user] = useAtom(userAtom);
//   const [allMembers, setAllMembers]: any = useAtom(currentMembers);
//   const [sentRequests, setSentRequests] = useAtom(currentSentRequests);
//   function cancelRequest() {
//     try {
//       dataFetch.post("/friends/cancelrequest", null, {
//         params: { sender: user?.data.user?.id, receiver: props.id },
//       });
//       const newRequests = sentRequests.filter((request: any) => {
//         return (
//           request.user1_id != user?.data.user?.id ||
//           request.user2_id != props.id
//         );
//       });
//       setSentRequests(newRequests);
//       const newMember = {
//         id:
//           allMembers.length > 0 ? allMembers[allMembers.length - 1].id + 1 : 1,
//         username: props.username,
//         auth_user_id: props.id,
//       };
//       setAllMembers([...allMembers, newMember]);
//     } catch (error) {
//       console.error(error);
//     }
//   }
//   return (
//     <div className="flex flex-col p-6 border-2 rounded-lg border-gray-500">
//       <div className="text-gray-200 pb-4">{props.username}</div>
//       <button
//         onClick={() => {
//           cancelRequest();
//         }}
//         className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background"
//       >
//         Cancel Request
//       </button>
//     </div>
//   );
// }
export default Friends;
