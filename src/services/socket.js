import { io } from "socket.io-client";


/* =========================================================
   NODE.JS SOCKET.IO SERVER
========================================================= */

const SOCKET_SERVER_URL = "http://192.168.56.1:3000";


/* =========================================================
   CREATE ONE SHARED SOCKET.IO CLIENT
========================================================= */

const socket = io(

    SOCKET_SERVER_URL,

    {
        transports: [
            "websocket",
            "polling"
        ],

        reconnection: true,

        reconnectionAttempts: Infinity,

        reconnectionDelay: 2000
    }

);


/* =========================================================
   SOCKET CONNECTION EVENTS
========================================================= */

socket.on(
    "connect",
    () => {

        console.log(
            "React Socket.IO connected:",
            socket.id
        );

    }
);


socket.on(
    "disconnect",
    (reason) => {

        console.log(
            "React Socket.IO disconnected:",
            reason
        );

    }
);


socket.on(
    "connect_error",
    (error) => {

        console.error(
            "React Socket.IO connection error:",
            error.message
        );

    }
);


export default socket;