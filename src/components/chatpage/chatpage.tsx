import * as React from "react";
import MainHeader from "./Header/MainHeader.tsx";

import Sidemenu from "./sidemenu/sidemenu.tsx";
// import { useLocation } from "react-router-dom";
const Chatpage: React.FC = () => {
  // const location = useLocation();
  // const { username } = location.state as { username: string }; // Type assertion to access the state

  return (
    <>
      <div style={{ height: "100vh" }}>
        <MainHeader />
        <Sidemenu />
      </div>
    </>
  );
};
export default Chatpage;
