// Define the Message type in a shared types file
// types.ts or messageTypes.ts (for example)

export interface Message {
  author: string;
  room: string;
  receiverID: number;
  ChatID: number;
  SenderID: number;
  Content: string;
  SentAt: string;
  IsDeleted: boolean;
  IsPinned: boolean;
}
export interface User {
  name: any;
  UserID: number;
  Username: string;
  ProfilePicture: undefined;
  GroupID: number;
  GroupName: string;
  isGroupChat: boolean;
}
export interface Group {}
export interface GroupChat {
  id: number;
  name: string;
  // Add any other relevant properties here
}
