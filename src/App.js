import "./App.css";
// import Header from './components/chatpage/header.tsx'
import Chatpage from "./components/chatpage/chatpage.tsx";
import Login from "./components/LoginForm/LoginForm.tsx";
import { UserProvider } from "./components/context/UserContext.tsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import VoiceCall from "./components/VoiceCall/Calls.tsx";
import UserActivityTracker from "./components/UserActivityTracker.tsx"; // Import the component
import VisibilityHandler from "./components/VisibilityHandler.tsx"; // Import the component
import VideoCall from "./components/videoCall/videoCall.tsx";
function App() {
  return (
    <UserProvider>
      <Router>
        <UserActivityTracker /> {/* Include the component */}
        <VisibilityHandler /> {/* Include the component */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/chatpage" element={<Chatpage />} />
          <Route path="/" exact element={<Login />} />
          <Route path="/call" exact element={<VoiceCall />} />
          <Route path="/video-call" element={<VideoCall />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
