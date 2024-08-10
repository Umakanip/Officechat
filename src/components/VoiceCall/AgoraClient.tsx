// last one

// import React, { useEffect } from "react"; // Import React and useEffect
// import AgoraRTC, {
//   IAgoraRTCClient,
//   ILocalAudioTrack,
//   IRemoteAudioTrack,
//   IMicrophoneAudioTrack,
//   UID,
// } from "agora-rtc-sdk-ng";

// interface AgoraClientProps {
//   channelName: string;
//   token: string;
//   isCallAccepted: boolean; // Prop to determine if the call is accepted
// }

// const AgoraClient: React.FC<AgoraClientProps> = ({
//   channelName,
//   token,
//   isCallAccepted,
// }) => {
//   const rtcClient: IAgoraRTCClient = AgoraRTC.createClient({
//     mode: "rtc",
//     codec: "vp8",
//   });

//   useEffect(() => {
//     const joinChannel = async () => {
//       try {
//         await rtcClient.join(token, channelName, null);

//         // Listen for the "user-published" event even before the call is accepted
//         rtcClient.on("user-published", async (user, mediaType) => {
//           await rtcClient.subscribe(user, mediaType);
//           if (mediaType === "audio") {
//             const remoteAudioTrack: IRemoteAudioTrack = user.audioTrack!;
//             remoteAudioTrack.play();
//           }
//         });

//         // Only create and publish the local audio track if the call is accepted
//         if (isCallAccepted) {
//           const localAudioTrack: IMicrophoneAudioTrack =
//             await AgoraRTC.createMicrophoneAudioTrack();
//           await rtcClient.publish([localAudioTrack]);
//         }
//       } catch (error) {
//         console.error("Error joining channel:", error);
//       }
//     };

//     joinChannel();

//     return () => {
//       rtcClient.leave();
//     };
//   }, [rtcClient, channelName, token, isCallAccepted]);

//   return <div></div>;
// };

// export default AgoraClient;



import React, { FC, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser, IMicrophoneAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { io } from 'socket.io-client';

interface AgoraClientProps {
  channelName: string;
  token: string;  
}

const AgoraClient: FC<AgoraClientProps> = ({ channelName, token }) => {
  const appId: string = "1369151da2df4f33bdd842b8c0797085"; // Replace with your actual Agora App ID
  const incomingCallSound = new Audio('/public/teams_default.mp3');

  useEffect(() => {
    const handleIncomingCall = (data: { channelName: string, token: string, callerId: number }) => {
      console.log('Incoming call:', data);
      incomingCallSound.play();
    };

    // Assuming you are using socket.io for real-time communication
    const socket = io();
    socket.on('incomingCall', handleIncomingCall);

    return () => {
      socket.off('incomingCall', handleIncomingCall);
    };
  }, [incomingCallSound]);
  
  useEffect(() => {
    const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

    console.log("App ID:", appId);
    console.log("Channel Name:", channelName);
    console.log("Token:", token);

    const init = async () => {
      try {
        // Join the channel
        console.log("appid",appId)
        await client.join(appId, channelName, token, null);
        console.log('Joined channel successfully');

        // Create and publish a local audio track
        const localAudioTrack: IMicrophoneAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        await client.publish([localAudioTrack]);
        console.log('Published audio track successfully');

        // Subscribe to remote users
        client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video' | 'datachannel') => {
          await client.subscribe(user, mediaType);

          if (mediaType === 'audio') {
            const remoteAudioTrack: IRemoteAudioTrack | undefined = user.audioTrack;
            remoteAudioTrack?.play();
          }

        });
      } catch (error) {
        console.log("appi2",appId)
        console.error('Failed to join the channel:', error);
      }
    };

    init();

    return () => {
      const leaveChannel = async () => {
        await client.leave();
        client.remoteUsers.forEach((user: IAgoraRTCRemoteUser) => {
          if (user.audioTrack) user.audioTrack.stop();
        });
      };
      leaveChannel();
    };
  }, [appId, channelName, token]);

 

  return <div></div>;
};

export default AgoraClient;

// import React, { FC, useEffect } from 'react';
// import AgoraRTC, { IAgoraRTCClient, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
// import { io } from 'socket.io-client';

// interface AgoraClientProps {
//   channelName: string;
//   token: string;
// }

// const AgoraClient: FC<AgoraClientProps> = ({ channelName, token }) => {
//   const appId: string = "1369151da2df4f33bdd842b8c0797085"; // Replace with your actual Agora App ID
//   const socket = io();

//   useEffect(() => {
//     const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

//     const init = async () => {
//       try {
//         // Join the channel
//         await client.join(appId, channelName, token, null);
//         console.log('Joined channel successfully');

//         // Listen for call acceptance
//         socket.on('callAccepted', async () => {
//           try {
//             // Create and publish a local audio track only if the call is accepted
//             const localAudioTrack: IMicrophoneAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//             await client.publish([localAudioTrack]);
//             console.log('Published audio track successfully');
//           } catch (error) {
//             console.error('Failed to create or publish audio track:', error);
//           }
//         });

//         // Handle call rejection
//         socket.on('callRejected', () => {
//           console.log('The call was rejected.');
//           // Optionally, handle rejection (e.g., notify the caller, close the call interface)
//         });

//         // Subscribe to remote users
//         client.on('user-published', async (user, mediaType) => {
//           try {
//             console.log('User published:', user);
//             await client.subscribe(user, mediaType);
//             console.log('Subscribed to user:', user);
//             if (mediaType === 'audio') {
//               console.log('Playing audio track');
//               user.audioTrack?.play();
//             }
//           } catch (error) {
//             console.error('Failed to subscribe to user:', error);
//           }
//         });
        
//       } catch (error) {
//         console.error('Failed to join the channel:', error);
//       }
//     };

//     init();

//     return () => {
//       const leaveChannel = async () => {
//         try {
//           await client.leave();
//           client.remoteUsers.forEach((user) => {
//             if (user.audioTrack) user.audioTrack.stop();
//           });
//           console.log('Left the channel successfully');
//         } catch (error) {
//           console.error('Failed to leave the channel:', error);
//         }
//       };
//       leaveChannel();
//     };
//   }, [appId, channelName, token, socket]);

//   return <div></div>;
// };

// export default AgoraClient;
