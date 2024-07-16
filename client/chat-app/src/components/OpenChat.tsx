import { Star,User,Send,Smile } from "lucide-react"
import './OpenChat.css'
function OpenChat() {
  return (
    <div className='w-full h-full flex flex-col'>
        <div className='header p-5 border-b-[1px] border-gray-700 flex flex-row'>
            <img src="https://lh3.googleusercontent.com/a/ACg8ocL-YWMvv3_1jvsT0PkuJiVrVGP1lWl_RQ9me-C_v4KBHUCZv6GT=s96-c" alt="" className="h-12 w-12 rounded-full"/>
            <div className='h-full pl-5'>
                <div className="text-lg text-gray-200 font-varela mb-auto">Rishit Bansal</div>
                <div className="text-sm text-gray-400 font-varela mb-auto">friend</div>
            </div>
            <div className='h-auto flex items-center gap-4 justify-center ml-auto flex flex-row'>
                <div className="rounded-3xl bg-light_gray pt-2 pb-2 pl-4 pr-4 flex flex-row justify-center items-center  gap-2">
                    <Star size={20} color="#e5e7eb"/>
                    <div className="font-varela text-sm text-gray-200">Priority</div>
                </div>
                <div className="rounded-3xl bg-light_gray pt-2 pb-2 pl-4 pr-4 flex flex-row justify-center items-center  gap-2">
                    <User size={20} color="#e5e7eb"/>
                    <div className="font-varela text-sm text-gray-200">Profile</div>
                </div>
            </div>
        </div>
        <div className="mt-auto flex flex-row">
            <div className="h-full w-1/12 border-gray-700 bg-light_gray flex items-center justify-center">
                <Smile size={30} color="#e5e7eb" className="ml-4 mr-4 mt-auto mb-auto"/>
            </div>
            <div className="form-control w-10/12">
                <input className="input input-alt" placeholder="Type something...." required type="text" />
                <span className="input-border input-border-alt"></span>
            </div>
            <div className="h-full w-1/12 border-gray-700 bg-light_gray flex items-center justify-center">
                <Send size={30} color="#e5e7eb" className="ml-4 mr-4 mt-auto mb-auto"/>
            </div>
        </div>
    </div>
  )
}

export default OpenChat