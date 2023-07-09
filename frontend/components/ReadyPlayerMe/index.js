import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import avatarStore from "./../../stores/avatar";

export default function RpmPopUp() {
  const iFrameRef = useRef(null);
  const { setAvatar, setUserMode, showIFrame, setShowIFrame } = avatarStore();

  useEffect(() => {
    let iFrame = iFrameRef.current;
    if (iFrame && process.env.ready_player_me) {
      iFrame.src = `https://${process.env.ready_player_me}.readyplayer.me/avatar?frameApi`;
    }
  });

  useEffect(() => {
    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe);
    return () => {
      window.removeEventListener("message", subscribe);
      document.removeEventListener("message", subscribe);
    };
  });

  function subscribe(event) {
    const json = parse(event);
    if (json?.source !== "readyplayerme") {
      return;
    }
    // Subscribe to all events sent from Ready Player Me
    // once frame is ready
    if (json.eventName === "v1.frame.ready") {
      let iFrame = iFrameRef.current;
      if (iFrame && iFrame.contentWindow) {
        iFrame.contentWindow.postMessage(
          JSON.stringify({
            target: "readyplayerme",
            type: "subscribe",
            eventName: "v1.**",
          }),
          "*"
        );
      }
    }
    // Get avatar GLB URL
    if (json.eventName === "v1.avatar.exported") {
      setAvatar(
        `${json.data.url}?quality=medium&useDracoMeshCompression=true&useMeshOptCompression=true`
      );
      setUserMode("avatar");
      setShowIFrame(false);
    }
    // Get user id
    if (json.eventName === "v1.user.set") {
      console.log(`User with id ${json.data.id} set:
      ${JSON.stringify(json)}`);
    }
  }

  return (
    <AppIframe>
      <iframe
        allow="camera *; microphone *"
        className="iFrame"
        id="frame"
        width="100%"
        height="90%"
        ref={iFrameRef}
        style={{
          display: `${showIFrame ? "block" : "none"}`,
        }}
        title={"Ready Player Me"}
      />
    </AppIframe>
  );
}

function parse(event) {
  try {
    return JSON.parse(event.data);
  } catch (error) {
    return null;
  }
}

const AppIframe = styled("div")`
  width: 100%;
  height: 100%;
`;
