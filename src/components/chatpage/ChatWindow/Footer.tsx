import React, {
  useEffect,
  useState,
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useUser } from "../../context/UserContext.tsx";
import io, { Socket } from "socket.io-client";
import { Message } from "./messagetypes";

interface FooterProps {
  userDetails: any;
  setMessageList: React.Dispatch<React.SetStateAction<Message[]>>;
}

const socket: Socket = io("http://localhost:5000");

const Footer: React.FC<FooterProps> = ({ userDetails, setMessageList }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const { user } = useUser();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const sendMessage = async () => {
    const currentTime = new Date();
    const messageData = {
      author: user?.userdata?.UserName,
      receiverID: userDetails.UserID ? userDetails.UserID : undefined,
      groupID: userDetails.GroupID ? userDetails.GroupID : undefined,
      SenderID: user?.userdata?.UserID,
      Content: currentMessage,
      SentAt: currentTime,
      IsDeleted: false,
      IsPinned: false,
      isGroupChat: userDetails.GroupID ? true : false,
    };

    try {
      if (selectedFile) {
        const base64File = await fileToBase64(selectedFile);
        const fileBlob = base64File.split(",")[1];

        const formData = {
          fileBlob,
          filename: selectedFile.name,
          filetype: selectedFile.type,
          filesize: selectedFile.size,
          MessageID: "5", // Ensure this is dynamic or handled correctly
        };

        // Upload the file to the server
        const response = await axios.post(
          "http://localhost:3000/api/uploadFile",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Set the file URL in the message content
        messageData.Content = response.data.fileUrl; // Assume server returns file URL
        setSelectedFile(null);
        setFilePreview(null);
      }

      if (currentMessage || selectedFile) {
        socket.emit("send_message", messageData);
        setcurrentMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    const handleMessageReceive = (data) => {
      console.log("Message received on client:", data);
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handleMessageReceive);
    return () => {
      socket.off("receive_message", handleMessageReceive);
    };
  }, [userDetails.UserID, setMessageList]);

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderTop: 1,
          borderColor: "divider",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", flexGrow: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={currentMessage}
            placeholder="Hey..."
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setcurrentMessage(event.target.value);
            }}
            onKeyPress={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
            InputProps={{
              endAdornment: selectedFile ? (
                <Tooltip title="Remove file">
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setSelectedFile(null);
                      setFilePreview(null);
                    }}
                    sx={{ p: 0.5 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              ) : null,
            }}
          />
          {filePreview && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                pointerEvents: "none", // Allows clicks to pass through the preview
              }}
            >
              <img
                src={filePreview}
                alt="File Preview"
                style={{
                  maxWidth: "100px",
                  maxHeight: "50px",
                  borderRadius: "4px",
                  marginRight: "10px",
                }}
              />
            </Box>
          )}
        </Box>
        <Button
          onClick={sendMessage}
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px" }}
        >
          &#9658;
        </Button>
        <IconButton onClick={handleClick} style={{ marginLeft: "10px" }}>
          <AttachFileIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <input
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-file"
            />
            <label htmlFor="upload-file">
              <Button component="span" variant="outlined" color="primary">
                Select File
              </Button>
            </label>
          </MenuItem>
          <MenuItem>
            <Button variant="outlined" color="primary">
              Attach Cloud Files
            </Button>
          </MenuItem>
        </Menu>
      </Box>
    </Container>
  );
};

export default Footer;
