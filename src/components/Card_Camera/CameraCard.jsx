import { useEffect, useRef } from "react";
import "./CameraCard.css";

function CameraCard({
  cameraName = "Camera",
  stream = null,
  status = "OFFLINE",
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    // Attach WebRTC MediaStream to video
    if (stream) {
      video.srcObject = stream;

      video
        .play()
        .catch((error) => {
          console.warn(
            "Video autoplay failed:",
            error
          );
        });
    }

    // Cleanup when stream changes
    return () => {
      if (video) {
        video.srcObject = null;
      }
    };
  }, [stream]);

  const getStatusClass = () => {
    switch (status) {
      case "ONLINE":
        return "camera-online";

      case "CONNECTING":
        return "camera-connecting";

      case "DISABLED":
        return "camera-disabled";

      default:
        return "camera-offline";
    }
  };

  return (
    <article className="camera-card">

      <div className="camera-video-container">

        {stream ? (
          <video
            ref={videoRef}
            className="camera-video"
            autoPlay
            playsInline
            muted
          />
        ) : (
          <div className="camera-no-signal">

            {status === "CONNECTING"
              ? "Connecting to camera..."
              : status === "DISABLED"
              ? "Camera disabled"
              : "Waiting for video..."}

          </div>
        )}

        <span
          className={`
            camera-status
            ${getStatusClass()}
          `}
        >
          {status}
        </span>

      </div>

      <div className="camera-card-footer">

        <h3>
          {cameraName}
        </h3>

      </div>

    </article>
  );
}

export default CameraCard;