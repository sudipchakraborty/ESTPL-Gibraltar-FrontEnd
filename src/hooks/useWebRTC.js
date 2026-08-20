import { useEffect, useState } from "react";

function useWebRTC(cameraId, serverUrl) {
  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("CONNECTING");

  useEffect(() => {
    let peerConnection;
    let retryTimer;
    let active = true;

    const waitForIceGathering = (connection) => {
      if (connection.iceGatheringState === "complete") return Promise.resolve();
      return new Promise((resolve) => {
        const handleStateChange = () => {
          if (connection.iceGatheringState === "complete") {
            connection.removeEventListener("icegatheringstatechange", handleStateChange);
            resolve();
          }
        };
        connection.addEventListener("icegatheringstatechange", handleStateChange);
      });
    };

    const connect = async () => {
      if (!active) return;
      setStatus("CONNECTING");
      try {
        peerConnection = new RTCPeerConnection();
        peerConnection.ontrack = (event) => {
          if (active && event.streams[0]) {
            setStream(event.streams[0]);
            setStatus("ONLINE");
          }
        };
        peerConnection.onconnectionstatechange = () => {
          if (!active) return;
          if (peerConnection.connectionState === "connected") setStatus("ONLINE");
          if (["failed", "disconnected", "closed"].includes(peerConnection.connectionState)) setStatus("OFFLINE");
        };
        const transceiver = peerConnection.addTransceiver("video", { direction: "recvonly" });
        // Hint supported browsers to minimize their playout/jitter buffer.
        try {
          transceiver.receiver.playoutDelayHint = 0;
          transceiver.receiver.jitterBufferTarget = 0;
        } catch {
          // These low-latency hints are optional browser extensions.
        }
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await waitForIceGathering(peerConnection);
        const response = await fetch(`${serverUrl}/offer`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ camera_id: cameraId, sdp: peerConnection.localDescription.sdp, type: peerConnection.localDescription.type }),
        });
        if (!response.ok) throw new Error(`WebRTC request failed: ${response.status}`);
        const answer = await response.json();
        if (answer.error) throw new Error(answer.error);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (error) {
        console.error(`Unable to connect ${cameraId}:`, error);
        if (peerConnection) peerConnection.close();
        setStatus("OFFLINE");
        if (active) retryTimer = window.setTimeout(connect, 3000);
      }
    };

    connect();
    return () => {
      active = false;
      window.clearTimeout(retryTimer);
      if (peerConnection) peerConnection.close();
    };
  }, [cameraId, serverUrl]);

  return { stream, status };
}

export default useWebRTC;
