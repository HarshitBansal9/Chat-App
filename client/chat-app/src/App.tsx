import Messages from "./pages/Messages";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Friends from "./pages/Friends";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-row">
        <Navbar />
        <Routes>
          <Route path="/" element={<Messages />} />
          <Route path="/login" element={<Login />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
