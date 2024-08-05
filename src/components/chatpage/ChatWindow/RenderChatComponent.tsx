// RenderChatComponent.tsx
import React from "react";
import SingleChatContent from "./SingleChatContent.tsx";
import GroupChatContent from "./GroupChatContent.tsx";
import { Message } from "./messagetypes.ts";

interface UserDetails {
  GroupID: number;
  isGroupChat: boolean;
  // Add other user details here
}

interface ChatComponentProps {
  userDetails: UserDetails;
  messageList: Message[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  userDetails,
  messageList,
}) => {
  const renderChatContent = () => {
    console.log("REnder component", userDetails);
    console.log("REnder component", messageList);
    if (userDetails?.GroupID) {
      console.log("IF");
      return (
        <GroupChatContent userDetails={userDetails} messageList={messageList} />
      );
    } else {
      console.log("ELSE");
      return (
        <SingleChatContent
          userDetails={userDetails}
          messageList={messageList}
        />
      );
    }
  };

  return <>{renderChatContent()}</>;
};

export default ChatComponent;
