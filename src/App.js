
import './App.css';
import Header from './components/chatpage/header.tsx'
import Sidemenu from './components/chatpage/sidemenu.tsx'
import LoginForm from './components/LoginForm/LoginForm';
function App() {
  return (
    <div className="App">
      <Header />
      <Sidemenu />
    </div>
  );
}

export default App;
