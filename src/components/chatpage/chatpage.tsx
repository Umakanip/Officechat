import * as React from "react";
import MainHeader from "./Header/MainHeader.tsx";

import Sidemenu from "./sidemenu/sidemenu.tsx";
const Chatpage: React.FC = () => {
  return (
    <>
      <div>
        <MainHeader />
        <Sidemenu />
      </div>
    </>
  );
};
export default Chatpage;
