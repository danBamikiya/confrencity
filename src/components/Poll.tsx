import React, {useState, useEffect, useContext} from 'react';
import Modal from 'react-modal';
import {Line} from 'rc-progress';
import styles from './pollStyles';

import ChatContext, {controlMessageEnum} from './ChatContext';
import {PollContext} from './PollContext';

const Poll = () => {
  const {
    question,
    setQuestions,
    answers: voteData,
    setAnswers,
    isModalOpen,
    setIsModalOpen,
  } = useContext(PollContext);
  const {sendControlMessage} = useContext(ChatContext);
  const [totalVotes, setTotalVotes] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    setTotalVotes(
      voteData
        .map((item: {option: string; votes: number}) => item.votes)
        .reduce((prev: number, next: number) => prev + next),
    );
  }, [voteData]);

  const submitVote = (chosenAnswer: {option: string; votes: number}) => {
    if (!voted) {
      const newAnswers = voteData.map(
        (answer: {option: string; votes: number}) => {
          if (chosenAnswer.option === answer.option) {
            return {...answer, votes: answer.votes + 1};
          }
          return answer;
        },
      );

      setAnswers(newAnswers);
      sendControlMessage(controlMessageEnum.initiatePoll, {
        question,
        answers: newAnswers,
      });
      setTotalVotes((prevTotalVotes) => prevTotalVotes + 1);
      setVoted((prevVoted) => !prevVoted);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTotalVotes(0);
    setVoted(false);
    setQuestions('');
    setAnswers([
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
      {option: '', votes: 0},
    ]);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Poll Modal"
      style={styles.customStyles}>
      <div>
        <h1>{question}</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
          {voteData &&
            voteData.map((answer: {option: string; votes: number}, i: number) =>
              !voted ? (
                <button
                  style={styles.button}
                  key={i}
                  onClick={() => submitVote(answer)}>
                  {answer.option}
                </button>
              ) : (
                <div style={styles.flexCenter} key={i}>
                  <h2 style={styles.mr20}>{answer.option}</h2>
                  <Line
                    percent={(answer.votes / totalVotes) * 100}
                    strokeWidth={5}
                    trailWidth={3}
                  />
                  <p style={styles.ml20}>{answer.votes}</p>
                </div>
              ),
            )}
        </div>
        <h3>Total Votes: {totalVotes}</h3>
      </div>
    </Modal>
  );
};

export default Poll;
