import { useEffect } from "react";
import axios from "axios";
import { useUser } from "./context/UserContext.tsx";

const VisibilityHandler: React.FC = () => {
  const { user } = useUser();

  useEffect(() => {
    const handleVisibilityChange = () => {
      //   if (document.hidden) {
      //     axios.post("http://localhost:3000/api/users", {
      //       userId: user?.userdata?.UserID,
      //       isActive: false,
      //     });
      //   } else {
      //     axios.post("http://localhost:3000/api/updateStatus", {
      //       userId: user?.userdata?.UserID,
      //       isActive: true,
      //     });
      //   }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [user]);

  return null;
};

export default VisibilityHandler;
