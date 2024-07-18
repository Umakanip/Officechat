
import './App.css';
// import Header from './components/chatpage/header.tsx'
 import Chatpage from './components/chatpage/chatpage.tsx'
import Login from './components/LoginForm/LoginForm.tsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  return (
   
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
       <Route path="/chatpage" element={<Chatpage />} />
      <Route path="/" exact element={<Login />} />
    </Routes>
  </Router>
  );
}

export default App;
