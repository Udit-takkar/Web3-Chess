import React, { useState, useEffect, useContext } from 'react';
import Chess from 'chess.js';
import Chessground from 'react-chessground';
import { Web3Context } from '../contexts/Web3Context';
import { makeFileObjects, storeFiles } from '../utils/web3storage';

import '../styles/chessground.css';
import '../styles/chessboard.css';

import queen from '../assets/wQ.svg';
import rook from '../assets/wR.svg';
import bishop from '../assets/wB.svg';
import knight from '../assets/wN.svg';

let uploaded = false;
let clockStarted = false;
let gameOver = false;

const drawOffer = {
  drawOffered: false,
  drawAccepted: false,
};

const elapsedTime = { white: 0, black: 0 };

function Play({ startColor, vsComputer, code }) {
  const { connectAccount, loading, account, disconnect, client } =
    useContext(Web3Context);

  const [chess] = useState(new Chess());
  const [pendingMove, setPendingMove] = useState();
  const [viewOnly, setViewOnly] = useState(true);
  const [lastMove, setLastMove] = useState();
  const [selectVisible, setSelectVisible] = useState(false);
  const [fen, setFen] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [orientation, setOrientation] = useState(startColor || 'white');
  const [color, setColor] = useState(startColor);
  // const [gameData, setGameData] = useState({
  const gameData = {
    streamID: '',
    uploader: '',
    black: {
      address: '',
      totalTime: 0,
      remainingTime: 0,
      increment: 0,
    },
    white: {
      address: '',
      totalTime: 0,
      remainingTime: 0,
      increment: 0,
    },
    startTime: -1,
    moveTimes: [],
    result: '*',
  };
  // });

  const currDate = new Date();
  const dateToday = `${currDate.getFullYear()}.${
    currDate.getMonth() + 1 < 10 ? '0' : ''
  }${currDate.getMonth() + 1}.${
    currDate.getDate() < 10 ? '0' : ''
  }${currDate.getDate()}`;
  const UTCDateToday = `${currDate.getFullYear()}.${
    currDate.getMonth() + 1 < 10 ? '0' : ''
  }${currDate.getMonth() + 1}.${
    currDate.getDate() < 10 ? '0' : ''
  }${currDate.getDate()}`;
  const opponentColor = startColor === 'white' ? 'black' : 'white';

  // function updateLog() {
  //   // called at every move (and then some)
  //   const game = chess.pgn();
  //   gameData.pgn = game;
  //   const moves = chess.history();

  //   const movePairs = [];
  //   for (let i = 0; i < moves.length; i += 2) {
  //     movePairs.push([
  //       moves[i],
  //       moves[i + 1] !== undefined ? moves[i + 1] : '',
  //     ]);
  //   }

  //   const displayedMoves = [];
  //   for (let i = 0; i < movePairs.length; i += 1) {
  //     displayedMoves.push(`${i + 1}. ${movePairs[i][0]} ${movePairs[i][1]}`);
  //   }

  //   const log = document.getElementById('innerLog');
  //   log.scrollTop = log.scrollHeight;
  //   log.innerHTML = `<p>${displayedMoves.join('<br></br>')}</p>`;

  //   if (vsComputer && !clockStarted) {
  //     clockStarted = true;
  //     gameData.startTime = Date.now();
  //   }

  //   if (chess.in_threefold_repetition()) {
  //     drawOffer.drawOffered = true; // draw offer extended to both players if in 3-fold rep
  //   }

  //   if (
  //     chess.game_over() ||
  //     gameData[startColor].remainingTime <= 0 ||
  //     gameData[opponentColor].remainingTime <= 0 ||
  //     (drawOffer.drawOffered && drawOffer.drawAccepted)
  //   ) {
  //     gameOver = true;
  //     let whiteWon = false;
  //     let gameDrawn = false;

  //     if (gameData[startColor].remainingTime <= 0) {
  //       // opponent wins on time
  //       whiteWon = startColor === 'black';
  //     } else if (gameData[opponentColor].remainingTime <= 0) {
  //       // home wins on time
  //       whiteWon = startColor === 'white';
  //     } else if (chess.game_over() && !chess.in_checkmate()) {
  //       // draw/stalemate
  //       whiteWon = false;
  //     }

  //     let finalComment = '';

  //     if (
  //       gameData[startColor].remainingTime <= 0 ||
  //       gameData[opponentColor].remainingTime <= 0
  //     ) {
  //       finalComment = ` ${whiteWon ? 'White' : 'Black'} wins on time. `;
  //       chess.header('Termination', 'Time forfeit');
  //     } else if (chess.in_stalemate()) {
  //       finalComment = ' Draw by stalemate. ';
  //     } else if (chess.in_draw() && !chess.insufficient_material()) {
  //       gameDrawn = true;
  //       finalComment = ' Draw by 50 move rule. ';
  //     } else if (chess.in_draw() && chess.insufficient_material()) {
  //       gameDrawn = true;
  //       finalComment = ' Draw by insufficent material. ';
  //     } else if (chess.in_checkmate()) {
  //       // check who moved last
  //       whiteWon = chess.history.length % 2 === 1; // odd means white moved last
  //       finalComment = ` ${whiteWon ? 'White' : 'Black'} wins by checkmate. `;
  //     } else if (chess.in_threefold_repetition()) {
  //       gameDrawn = true;
  //       finalComment = ' Draw by threefold repetition. ';
  //     }
  //     chess.set_comment(finalComment);
  //     const gameResult = gameDrawn ? '1/2-1/2' : whiteWon ? '1-0' : '0-1';
  //     chess.header(
  //       'Event',
  //       'deChess Casual Game',
  //       'Site',
  //       'https://dechess.eth.link',
  //       'Date',
  //       dateToday,
  //       'White',
  //       gameData.white.address,
  //       'Black',
  //       gameData.black.address,
  //       'UTCDate',
  //       UTCDateToday,
  //       'UTCTime',
  //       `${currDate.getUTCHours()}:${currDate.getUTCMinutes()}:${
  //         currDate.getUTCSeconds.length === 1 ? '0' : ''
  //       }${currDate.getUTCSeconds()}`,
  //       'WhiteElo',
  //       gameData.white.rating,
  //       'BlackElo',
  //       gameData.black.rating,
  //       'Annotator',
  //       'dechess.eth',
  //       'Result',
  //       gameResult,
  //     );
  //     gameData.result = gameResult;
  //     gameData.pgn = chess.pgn();
  //     if (!uploaded) {
  //       const uploadedFiles = makeFileObjects(gameData);
  //       const uploadedFilesCID = storeFiles(uploadedFiles);
  //       uploaded = true;
  //       return uploadedFilesCID;
  //     }
  //   }

  //   return '';
  // }

  const home = gameData[startColor];
  const opponent = gameData[opponentColor];

  const boardsize =
    Math.round((Math.min(window.innerWidth, window.innerHeight) * 0.8) / 8) * 8;
  const turnColor = () => (chess.turn() === 'w' ? 'white' : 'black');
  const calcMovable = () => {
    const dests = new Map();
    if (!viewOnly) {
      chess.SQUARES.forEach(s => {
        const ms = chess.moves({ square: s, verbose: true });
        if (ms.length)
          dests.set(
            s,
            ms.map(m => m.to),
          );
      });
    }
    return {
      free: false,
      dests,
    };
  };

  const randomMove = () => {
    const moves = chess.moves({ verbose: true });
    const move = moves[Math.floor(Math.random() * moves.length)];
    if (moves.length > 0) {
      chess.move(move.san);
      setFen(chess.fen());
      setLastMove([move.from, move.to]);
      setChecked(chess.in_check());
    }
    setViewOnly(false);
    // updateLog();
  };

  const onMove = (from, to) => {
    const moves = chess.moves({ verbose: true });
    for (let i = 0, len = moves.length; i < len; i += 1) {
      if (moves[i].flags.indexOf('p') !== -1 && moves[i].from === from) {
        setPendingMove([from, to]);
        if (turnColor() === startColor) {
          setSelectVisible(true);
        }
        return;
      }
    }
    if (chess.move({ from, to, promotion: 'q' })) {
      setFen(chess.fen());
      setLastMove([from, to]);
      setChecked(chess.in_check());
      setColor(turnColor());
      if (vsComputer) {
        setTimeout(randomMove, 500);
      } else {
        client.publish(code, {
          type: 'move',
          move: { from, to, promotion: 'q' },
          from: gameData[startColor].address,
          time: Date.now(),
          fen: chess.fen(),
        });
      }
    }
  };

  return (
    <div className="flex">
      <Chessground
        width={boardsize}
        height={boardsize}
        turnColor={turnColor()}
        movable={calcMovable()}
        lastMove={lastMove}
        fen={fen}
        onMove={onMove}
        highlight={{
          check: true,
          lastMove: true,
        }}
        premovable={{
          enabled: true,
          showDests: true,
          castle: true,
        }}
        check={isChecked}
        orientation={orientation}
      />
      <div className="Chat">
        <div>Chat Box</div>
      </div>
    </div>
  );
}

export default Play;
