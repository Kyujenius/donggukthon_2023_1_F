import React, { useState } from "react";
import styles from "./Home.module.scss";
import Button from "../components/Button";

function RoomMake() {
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  const handleMakeRoomButton = () => {
    console.log("방을 생성하겠습니다.");
  };

  return (
    <div className={styles.container}>
      {imageLoaded ? (
        <div className={styles.ImgandObjectContainer}>
          <div className={styles.imageContainer}>
            <img
              src="/assets/snow-character.png"
              alt="Decorative Snowflake"
              onLoad={handleImageLoad}
            />
          </div>
          <div className={styles.inputContainer}>
            <input placeholder="그룹 명을 설정하세요."></input>
          </div>
          <Button text={"생성하기"} onClick={handleMakeRoomButton} />
        </div>
      ) : (
        // 이미지가 로드되는 동안 표시할 로딩 표시기 또는 플레이스홀더
        <div>Loading...</div>
      )}
    </div>
  );
}

export default RoomMake;
