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
    if (userDetails?.GroupID) {
      return (
        <GroupChatContent userDetails={userDetails} messageList={messageList} />
      );
    } else {
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
