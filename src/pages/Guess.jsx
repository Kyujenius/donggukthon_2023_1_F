import React, { useState } from 'react';
import styles from './Home.module.scss';
import Button from '../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../stores/user';
import { getVoteGuess, guess } from '../api/vote';
import { useMutation, useQuery } from 'react-query';

function Guess() {
  const user = useRecoilValue(userState);
  const { groupId } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const questionIdFromParam = searchParams.get('question') || -1; // URL에서 질문 ID 가져오기
  const [imageLoaded, setImageLoaded] = useState(true);
  const navigator = useNavigate();
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  const {
    data: guessData,
    error,
    isLoading,
  } = useQuery(
    ['guess', user.memberId, groupId, questionIdFromParam],
    () => getVoteGuess(user.memberId, groupId, questionIdFromParam),
    {
      select: guessData => guessData.data,
      onError: () => {
        console.log('질문 가져오기 실패');
      },
    },
  );
  const { mutate: guessMember } = useMutation(args =>
    guess(args.memberId, args.selectedMemberId, args.questionId, args.groupId),
  );

  const hanedleClickNameButton = selectedMemberId => {
    // 추측하기
    guessMember({
      memberId: user.memberId,
      selectedMemberId: selectedMemberId,
      questionId: questionIdFromParam,
      groupId: groupId,
    });

    navigator('/guessWrongResult');
  };

  return (
    guessData && (
      <div className={styles.container}>
        {imageLoaded ? (
          <div className={styles.ImgandObjectContainer}>
            <div className={styles.snowDollarContainer}>
              {/* 나중에 대체되어야 함.*/}
              <h1>{'나를 뽑을 것 같은 사람은?'}</h1>
              <img src="/assets/snow-dollar.png" alt="snowDollar" onLoad={handleImageLoad} />
              <span>{` : ${guessData.snowflakes}`}</span>
            </div>
            <div className={styles.questionContainer}>
              <h1>{`Q. ${guessData.question}`}</h1>
            </div>
            <div className={styles.guessPeoplesContainer}>
              {guessData.optionList.map(option => (
                <Button
                  key={option.memberId}
                  text={option.memberName}
                  onClick={() => hanedleClickNameButton(option.memberId)}
                />
              ))}
            </div>
          </div>
        ) : (
          // 이미지가 로드되는 동안 표시할 로딩 표시기 또는 플레이스홀더
          <div>Loading...</div>
        )}
      </div>
    )
  );
}

export default Guess;
