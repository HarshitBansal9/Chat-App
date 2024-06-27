import { createClient } from "@supabase/supabase-js";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6amF1dWNpeXB5d3l5cnlyY3Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkzODQxNjQsImV4cCI6MjAzNDk2MDE2NH0.U0W-gzxacfecnN3ZlW4KYGeLfKfu1k5ku2zkdap5oas";
const SUPABASE_URL = "https://wzjauuciypywyyryrcvt.supabase.co";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
function Login() {
  async function loginWithProvider() {
    console.log("reahced here")
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google'    
    });
    console.log(data, error);
  }
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-gray-100 px-4">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight font-pixel text-gray-900">
            Welcome to Finance App
          </h1>
          <p className="mt-2 text-gray-500 font-pixel text-lg ">
            Sign in to access your financial dashboard.
          </p>
        </div>
        <button onClick={()=>{loginWithProvider()}} className="flex w-full items-center justify-center font-pixel gap-2 rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2">
          <ChromeIcon className="h-6 w-6" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

export default Login;
