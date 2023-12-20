import React, { useEffect, useState } from 'react';
import styles from './Home.module.scss';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { userState } from '../stores/user';
import { acceptInvitation } from '../api/invitation';
import { useMutation } from 'react-query';
import { useRecoilValue } from 'recoil';

function Home() {
  const [imageLoaded, setImageLoaded] = useState(true);
  const inviterID = localStorage.getItem('InviterID');
  const groupID = localStorage.getItem('GroupID');
  const user = useRecoilValue(userState);
  //memberID 가져오기, fetching 해야함.
  const memberID = user.memberId;

  const navigate = useNavigate();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  const hanldMakeRoomButton = () => {
    navigate('/groupMake');
  };
  const handleGroupListButton = () => {
    navigate('/groupList');
  };

  const {
    mutate: acceptGroupInvitation,
    error,
    isLoading,
  } = useMutation(args => acceptInvitation(args.memberID, args.groupID, args.inviterID), {
    onSuccess: () => {
      console.log(memberID, '님이', groupID, '에 참가했습니다.');
      localStorage.removeItem('InviterID');
      localStorage.removeItem('GroupID');
      // 추가적인 성공 로직 (예: 페이지 리디렉션)
    },
    onError: error => {
      console.log('초대 수락 실패: ', error);
      // 에러 핸들링 로직
    },
  });

  useEffect(() => {
    if (inviterID && groupID) {
      acceptGroupInvitation({ memberID: memberID, inviterID: inviterID, groupID: groupID });
    }
  }, [memberID, inviterID, groupID, acceptGroupInvitation]);

  return (
    <div className={styles.container}>
      {imageLoaded ? (
        <div className={styles.ImgandObjectContainer}>
          <div className={styles.imageContainer}>
            <img src="/assets/snow-character.png" alt="Decorative Snowflake" onLoad={handleImageLoad} />
          </div>
          <div className={styles.buttonsContainer}>
            <Button text={'그룹 만들기'} onClick={hanldMakeRoomButton} />
            <Button text={'내 그룹 들어가기'} onClick={handleGroupListButton} />
          </div>
        </div>
      ) : (
        // 이미지가 로드되는 동안 표시할 로딩 표시기 또는 플레이스홀더
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Home;
