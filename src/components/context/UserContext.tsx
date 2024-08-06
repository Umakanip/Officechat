import React, { createContext, useState, useContext, ReactNode } from "react";
import axios from "axios";

interface UserDetails {
  userdata: any;
  // Add other user details here
}

interface GroupDetails {
  groupID: number;
  groupName: string;
  CreatedAt: string;
  // Add other group details here if needed
}

interface UserContextProps {
  user: UserDetails | null;
  setUser: React.Dispatch<React.SetStateAction<UserDetails | null>>;
  groups: GroupDetails[]; // Add this line
  setGroups: React.Dispatch<React.SetStateAction<GroupDetails[]>>; // Add this line
  activeGroup: number | null;
  setActiveGroup: (GroupID: number | null) => void;
  activeUser: number | null;
  setActiveUser: (UserID: number | null) => void;
  selectedUserId: number | null;
  setSelectedUserId: (userId: number | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [groups, setGroups] = useState<GroupDetails[]>([]); // Add this state
  const [activeGroup, setActiveGroup] = useState<number | null>(null);
  const [activeUser, setActiveUser] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const logout = () => {
    setUser(null);
    // Optionally, perform additional cleanup (e.g., clear tokens)
    // e.g., localStorage.removeItem('userToken');
  };
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        groups,
        setGroups,
        activeGroup,
        setActiveGroup,
        activeUser,
        setActiveUser,
        selectedUserId,
        setSelectedUserId,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
