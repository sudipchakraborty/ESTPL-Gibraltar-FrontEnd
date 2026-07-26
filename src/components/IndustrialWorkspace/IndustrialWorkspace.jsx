import {
  useEffect,
  useRef,
  useState,
} from "react";

import CameraCard from "../Card_Camera/CameraCard";
import InspectionTable from "../InspectionTable/InspectionTable";

import "./IndustrialWorkspace.css";


// ==========================================================
// WEBRTC SERVER CONFIGURATION
// ==========================================================

const WEBRTC_SERVER =
  "http://localhost:8000";


// ==========================================================
// CAMERA CONFIGURATION
//
// Each enabled camera creates:
// 1 separate WebRTC peer connection
// 1 separate video stream
//
// AI processing remains configured in:
//
// EdgeNode/config/camera.json
// ==========================================================

const CAMERA_CONFIGURATION = [

  {
    id: "camera_1",
    name: "Camera 01",
    enabled: true,
  },

  {
    id: "camera_2",
    name: "Camera 02",
    enabled: true,
  },

  {
    id: "camera_3",
    name: "Camera 03",
    enabled: true,
  },

];


// ==========================================================
// INDUSTRIAL WORKSPACE
// ==========================================================

function IndustrialWorkspace() {

  // ========================================================
  // ACTIVE NAVIGATION VIEW
  // ========================================================

  const [
    activeView,
    setActiveView,
  ] = useState("cameras");


  // ========================================================
  // CAMERA VIDEO STREAMS
  //
  // Example:
  //
  // {
  //   camera_1: MediaStream,
  //   camera_2: MediaStream,
  //   camera_3: MediaStream
  // }
  // ========================================================

  const [
    cameraStreams,
    setCameraStreams,
  ] = useState({});


  // ========================================================
  // CAMERA CONNECTION STATUS
  //
  // Example:
  //
  // {
  //   camera_1: "ONLINE",
  //   camera_2: "CONNECTING",
  //   camera_3: "OFFLINE"
  // }
  // ========================================================

  const [
    cameraStatuses,
    setCameraStatuses,
  ] = useState(() => {

    const initialStatuses = {};

    CAMERA_CONFIGURATION.forEach(
      (camera) => {

        initialStatuses[camera.id] =
          camera.enabled
            ? "CONNECTING"
            : "DISABLED";

      }
    );

    return initialStatuses;

  });


  // ========================================================
  // WEBRTC PEER CONNECTION STORAGE
  //
  // Peer connections are stored in a ref because changing
  // them should not cause React to render again.
  // ========================================================

  const peerConnectionsRef =
    useRef({});


  // ========================================================
  // UPDATE ONE CAMERA STATUS
  // ========================================================

  const updateCameraStatus = (

    cameraId,

    status

  ) => {

    setCameraStatuses(

      (previousStatuses) => ({

        ...previousStatuses,

        [cameraId]:
          status,

      })

    );

  };


  // ========================================================
  // CONNECT ONE CAMERA THROUGH WEBRTC
  // ========================================================

  const connectCamera = async (

    camera,

    componentState

  ) => {

    const cameraId =
      camera.id;


    try {

      console.log(

        `[WEBRTC] Connecting: ${cameraId}`

      );


      updateCameraStatus(

        cameraId,

        "CONNECTING"

      );


      // ====================================================
      // CREATE AN INDIVIDUAL WEBRTC CONNECTION
      // ====================================================

      const peerConnection =

        new RTCPeerConnection();


      // Save connection by camera ID

      peerConnectionsRef.current[

        cameraId

      ] = peerConnection;


      // ====================================================
      // RECEIVE CAMERA VIDEO
      // ====================================================

      peerConnection.ontrack = (

        event

      ) => {

        console.log(

          `[WEBRTC] Track received: ${cameraId}`

        );


        if (

          !componentState.active

        ) {

          return;

        }


        if (

          event.streams

          &&

          event.streams[0]

        ) {

          setCameraStreams(

            (previousStreams) => ({

              ...previousStreams,

              [cameraId]:

                event.streams[0],

            })

          );


          updateCameraStatus(

            cameraId,

            "ONLINE"

          );

        }

      };


      // ====================================================
      // MONITOR WEBRTC CONNECTION
      // ====================================================

      peerConnection
        .onconnectionstatechange = () => {

          const connectionState =

            peerConnection
              .connectionState;


          console.log(

            `[WEBRTC] ${cameraId}:`,

            connectionState

          );


          if (

            !componentState.active

          ) {

            return;

          }


          if (

            connectionState

            ===

            "connected"

          ) {

            updateCameraStatus(

              cameraId,

              "ONLINE"

            );

          }


          if (

            connectionState

            ===

            "connecting"

          ) {

            updateCameraStatus(

              cameraId,

              "CONNECTING"

            );

          }


          if (

            connectionState

            ===

            "failed"

            ||

            connectionState

            ===

            "disconnected"

            ||

            connectionState

            ===

            "closed"

          ) {

            updateCameraStatus(

              cameraId,

              "OFFLINE"

            );

          }

        };


      // ====================================================
      // REQUEST VIDEO ONLY
      // ====================================================

      peerConnection.addTransceiver(

        "video",

        {

          direction:
            "recvonly",

        }

      );


      // ====================================================
      // CREATE WEBRTC OFFER
      // ====================================================

      const offer =

        await

        peerConnection
          .createOffer();


      await

      peerConnection
        .setLocalDescription(

          offer

        );


      // ====================================================
      // SEND OFFER TO PYTHON EDGE NODE
      // ====================================================

      const response =

        await fetch(

          `${WEBRTC_SERVER}/offer`,

          {

            method:
              "POST",


            headers: {

              "Content-Type":

                "application/json",

            },


            body:

              JSON.stringify({

                sdp:

                  peerConnection
                    .localDescription
                    .sdp,


                type:

                  peerConnection
                    .localDescription
                    .type,


                camera_id:

                  cameraId,

              }),

          }

        );


      if (

        !response.ok

      ) {

        throw new Error(

          `WebRTC server returned: `

          +

          response.status

        );

      }


      // ====================================================
      // RECEIVE WEBRTC ANSWER
      // ====================================================

      const answer =

        await

        response.json();


      await

      peerConnection
        .setRemoteDescription(

          new RTCSessionDescription(

            answer

          )

        );


      console.log(

        `[WEBRTC] Answer received: ${cameraId}`

      );

    }


    catch (

      error

    ) {

      console.error(

        `[WEBRTC ERROR] ${cameraId}:`,

        error

      );


      if (

        componentState.active

      ) {

        updateCameraStatus(

          cameraId,

          "OFFLINE"

        );

      }

    }

  };


  // ========================================================
  // CONNECT ALL ENABLED CAMERAS
  // ========================================================

  useEffect(() => {

    const componentState = {

      active:
        true,

    };


    // Start one WebRTC connection for every enabled camera

    CAMERA_CONFIGURATION

      .filter(

        (camera) =>

          camera.enabled

      )

      .forEach(

        (camera) => {

          connectCamera(

            camera,

            componentState

          );

        }

      );


    // ======================================================
    // COMPONENT CLEANUP
    // ======================================================

    return () => {

      componentState.active =

        false;


      Object.values(

        peerConnectionsRef.current

      ).forEach(

        (peerConnection) => {

          if (

            peerConnection

          ) {

            peerConnection.close();

          }

        }

      );


      peerConnectionsRef.current =

        {};

    };

  }, []);


  // ========================================================
  // DYNAMIC MIDDLE CONTENT
  // ========================================================

  const renderMiddleContent = () => {

    switch (

      activeView

    ) {


      // ====================================================
      // LIVE CAMERA VIEW
      // ====================================================

      case "cameras":

        return (

          <>

            <div

              className=
                "camera-grid"

            >

              {

                CAMERA_CONFIGURATION.map(

                  (camera) => (

                    <CameraCard

                      key={
                        camera.id
                      }

                      cameraName={
                        camera.name
                      }

                      stream={

                        cameraStreams[

                          camera.id

                        ]

                        ||

                        null

                      }

                      status={

                        cameraStatuses[

                          camera.id

                        ]

                        ||

                        (

                          camera.enabled

                            ?

                            "CONNECTING"

                            :

                            "DISABLED"

                        )

                      }

                    />

                  )

                )

              }

            </div>


            {/* Socket.IO inspection table */}

            <InspectionTable />

          </>

        );


      // ====================================================
      // INSPECTION HISTORY
      // ====================================================

      case "history":

        return (

          <div

            className=
              "content-placeholder"

          >

            <h2>

              Inspection History

            </h2>


            <p>

              Historical inspection

              records will appear here.

            </p>

          </div>

        );


      // ====================================================
      // AI ANALYTICS
      // ====================================================

      case "analytics":

        return (

          <div

            className=
              "content-placeholder"

          >

            <h2>

              AI Analytics

            </h2>


            <p>

              Inspection analytics

              will appear here.

            </p>

          </div>

        );


      // ====================================================
      // INSPECTION EVENTS
      // ====================================================

      case "events":

        return (

          <div

            className=
              "content-placeholder"

          >

            <h2>

              Inspection Events

            </h2>


            <p>

              AI detection events

              will appear here.

            </p>

          </div>

        );


      default:

        return null;

    }

  };


  // ========================================================
  // USER INTERFACE
  // ========================================================

  return (

    <main

      className=
        "industrial-workspace"

    >


      {/* ==================================================
          LEFT NAVIGATION
      ================================================== */}


      <aside

        className=
          "workspace-left"

      >

        <div

          className=
            "panel-title"

        >

          Navigation

        </div>


        <button

          className={

            activeView

            ===

            "cameras"

              ?

              "menu-button active"

              :

              "menu-button"

          }

          onClick={() =>

            setActiveView(

              "cameras"

            )

          }

        >

          Live Cameras

        </button>


        <button

          className={

            activeView

            ===

            "history"

              ?

              "menu-button active"

              :

              "menu-button"

          }

          onClick={() =>

            setActiveView(

              "history"

            )

          }

        >

          History

        </button>


        <button

          className={

            activeView

            ===

            "analytics"

              ?

              "menu-button active"

              :

              "menu-button"

          }

          onClick={() =>

            setActiveView(

              "analytics"

            )

          }

        >

          Analytics

        </button>


        <button

          className={

            activeView

            ===

            "events"

              ?

              "menu-button active"

              :

              "menu-button"

          }

          onClick={() =>

            setActiveView(

              "events"

            )

          }

        >

          Events

        </button>

      </aside>


      {/* ==================================================
          DYNAMIC MIDDLE WORKSPACE
      ================================================== */}


      <section

        className=
          "workspace-middle"

      >

        <div

          className=
            "middle-header"

        >

          <div>

            <h1>

              Industrial Visual AI

            </h1>


            <p>

              Real-time monitoring

              and AI inspection

            </p>

          </div>


          <span

            className=
              "system-status"

          >

            SYSTEM ONLINE

          </span>

        </div>


        <div

          className=
            "middle-content"

        >

          {

            renderMiddleContent()

          }

        </div>

      </section>


      {/* ==================================================
          RIGHT CONTROL PANEL
      ================================================== */}


      <aside

        className=
          "workspace-right"

      >

        <div

          className=
            "panel-title"

        >

          Camera Control

        </div>


        <button

          className=
            "action-button"

        >

          + Add Camera

        </button>


        <button

          className=
            "control-button"

        >

          Camera Settings

        </button>


        <button

          className=
            "control-button"

        >

          AI Configuration

        </button>


        <button

          className=
            "control-button"

        >

          Inspection Rules

        </button>

      </aside>

    </main>

  );

}


export default IndustrialWorkspace;