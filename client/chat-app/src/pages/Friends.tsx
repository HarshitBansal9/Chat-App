import { useAtom } from "jotai"
import { currentFriends, currentMembers, currentRequests } from "../lib/Atoms";
import { userAtom } from "../App";
import { useEffect } from "react";
import dataFetch from "../axios";
function Friends() {
  const [requests,setRequests] = useAtom(currentRequests);
  const [members,setMembers] = useAtom(currentMembers);
  useEffect(() => {
    async function getDetails(){
      const details = await dataFetch.get('/friends/getdetails'); 
      setMembers(details.data.allMembers);
      setRequests(details.data.allRequests);
    }
    getDetails();
  },[]);
  return (
    <div className="bg-custom_background w-full flex flex-col">
      <div className="friends flex flex-col">
        <div className="w-full font-pixel text-gray-200 text-2xl p-4">Friends</div>
        <div className="font-pixel text-stone-500 text-lg pl-4 pt-2">No current friends</div>
      </div>
      <div className="friends flex flex-col">
        <div className="w-full font-pixel text-gray-200 text-2xl p-4">Current Requests</div>
        {(requests.length === 0)?(<div className="font-pixel text-stone-500 text-lg pl-4 pt-2">No current requests</div>):(
          <div className="font-pixel text-lg pl-4 pt-2 flex flex-row">
            {requests.map((request:any) => {
              return <RequestCard key={request.id} username={request.username} id={request.user1_id}></RequestCard>
            })}
          </div>
        )}
      </div>
      <div className="friends flex flex-col">
        <div className="w-full font-pixel text-gray-200 text-2xl p-4">Other Members</div>
        {(members.length === 0)?(<div className="font-pixel text-stone-500 text-lg pl-4 pt-2">No current members</div>):(
          <div className="font-pixel text-lg pl-4 pt-2 flex flex-row">
            {members.map((member:any) => {
              return <MemberCard key={member.id} username={member.username} id={member.auth_user_id}></MemberCard>
            })}
          </div>
        )}
      </div> 
    </div>
  )
}
interface MemberCardProps {
  username:string
  id:string
}
function RequestCard(props:MemberCardProps){
  const [user] = useAtom(userAtom);
  function handleRequest(accepted:boolean){
    try {

      dataFetch.post('/friends/handleRequest',null,{params:{accepted:accepted,sender:props.id,receiver:user?.data.user?.id}});
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex flex-col p-6 border-2 rounded-lg border-gray-500">
      <div className="text-gray-200 pb-4">{props.username}</div>
      <button onClick={()=>{handleRequest(true)}} className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background">Accept Request</button>
      <button onClick={()=>{handleRequest(false)}} className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background">Reject Request</button>
    </div>
  )

}
function MemberCard(props:MemberCardProps){
  const [user] = useAtom(userAtom);
  function sendRequest(){
    try {
      dataFetch.post('/friends/sendrequest',null,{params:{sender:user?.data.user?.id,receiver:props.id}});
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="flex flex-col p-6 border-2 rounded-lg border-gray-500">
      <div className="text-gray-200 pb-4">{props.username}</div>
      <button onClick={()=>{sendRequest()}} className="p-2 border-[1px] border-gray-500 rounded-lg text-gray-200 hover:cursor:pointer hover:bg-navbar_background">Send Request</button>
    </div>
  )
}

export default Friends