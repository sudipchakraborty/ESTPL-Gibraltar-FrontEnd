import {
  useEffect,
  useState,
} from "react";


function useWebRTC(
  cameraId,
  serverUrl
) {

  const [
    stream,
    setStream,
  ] = useState(null);


  useEffect(() => {

    let peerConnection;

    let active = true;


    const connectCamera =
      async () => {

        try {

          peerConnection =
            new RTCPeerConnection();


          peerConnection.ontrack =
            (event) => {

              if (
                active &&
                event.streams[0]
              ) {

                setStream(
                  event.streams[0]
                );

              }

            };


          peerConnection.addTransceiver(
            "video",
            {
              direction:
                "recvonly",
            }
          );


          const offer =
            await peerConnection
              .createOffer();


          await peerConnection
            .setLocalDescription(
              offer
            );


          const response =
            await fetch(

              `${serverUrl}/offer/${cameraId}`,

              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({

                  sdp:
                    peerConnection
                      .localDescription
                      .sdp,

                  type:
                    peerConnection
                      .localDescription
                      .type,

                }),

              }

            );


          if (!response.ok) {

            throw new Error(

              `WebRTC request failed: ${response.status}`

            );

          }


          const answer =
            await response.json();


          await peerConnection
            .setRemoteDescription(

              new RTCSessionDescription(
                answer
              )

            );


        } catch (error) {

          console.error(

            `Unable to connect ${cameraId}:`,

            error

          );

        }

      };


    connectCamera();


    return () => {

      active = false;


      if (
        peerConnection
      ) {

        peerConnection.close();

      }


      setStream(null);

    };


  }, [
    cameraId,
    serverUrl,
  ]);


  return stream;

}


export default useWebRTC;