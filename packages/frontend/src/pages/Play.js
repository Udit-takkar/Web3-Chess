import React, { useState, useEffect, useContext, useRef } from 'react';
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

// ## pass code && game data from context
function Play({ startColor, vsComputer }) {
  const { connectAccount, loading, account, disconnect, client } =
    useContext(Web3Context);
  const clockStarted = useRef(false);
  const [code, setCode] = useState(
    '0xDc9FC2d9aB39B4dE70Cbae0A095A2a7d2Cf75065/chess/1637481377673',
  );

  const [chess] = useState(new Chess());
  const [areBothPlayerJoined, setBothPlayersJoined] = useState(false);
  const [pendingMove, setPendingMove] = useState();
  const [isMyMove, setIsMyMove] = useState(true);
  const [lastMove, setLastMove] = useState();
  const [selectVisible, setSelectVisible] = useState(false);
  const [fen, setFen] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [orientation, setOrientation] = useState(startColor || 'white');
  const [color, setColor] = useState(startColor);
  const [pgn, setPgn] = useState(null);
  const [matchStartTime, setMatchStartTime] = useState(null);
  const [game, setGame] = useState({
    white: {
      address: null,
      remainingTime: null,
    },
    black: {
      address: null,
      remainingTime: null,
    },
  });

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

  const publishMove = async (code, from, to, moves) => {
    await client.publish(code, {
      type: 'move',
      move: { from, to },
      from: game[startColor].address,
      time: Date.now(),
      fen: chess.fen(),
      moves,
    });
  };

  async function updateLog() {
    const game = chess.pgn();
    // This pgn has to be saved
    setPgn(game);
    const moves = chess.history();
    const movePairs = [];
    for (let i = 0; i < moves.length; i += 2) {
      movePairs.push([
        moves[i],
        moves[i + 1] !== undefined ? moves[i + 1] : '',
      ]);
    }

    const displayedMoves = [];
    for (let i = 0; i < movePairs.length; i += 1) {
      displayedMoves.push(`${i + 1}. ${movePairs[i][0]} ${movePairs[i][1]}`);
    }

    // ###Add Moves here Imrove this bullshit way of updating move

    // const log = document.getElementById('innerLog');
    // log.scrollTop = log.scrollHeight;
    // log.innerHTML = `<p>${displayedMoves.join('<br></br>')}</p>`;

    // if (vsComputer && !clockStarted.current) {
    //   clockStarted.current = true;
    //   setStartTime(Date.now())
    // }

    if (chess.in_threefold_repetition()) {
      // drawOffer.drawOffered = true; // draw offer extended to both players if in 3-fold rep
      //  ### End this Match Here and return
    }

    if (
      chess.game_over() ||
      game[startColor].remainingTime <= 0 ||
      game[opponentColor].remainingTime <= 0
    ) {
      // gameOver = true;
      let whiteWon = false;
      let gameDrawn = false;

      if (game[startColor].remainingTime <= 0) {
        // opponent wins on time
        whiteWon = startColor === 'black';
      } else if (game[opponentColor].remainingTime <= 0) {
        // home wins on time
        whiteWon = startColor === 'white';
      }

      let finalComment = '';

      if (
        game[startColor].remainingTime <= 0 ||
        game[opponentColor].remainingTime <= 0
      ) {
        finalComment = ` ${whiteWon ? 'White' : 'Black'} wins on time. `;
        chess.header('Termination', 'Time forfeit');
      } else if (chess.in_stalemate()) {
        finalComment = ' Draw by stalemate. ';
      } else if (chess.in_draw() && !chess.insufficient_material()) {
        gameDrawn = true;
        finalComment = ' Draw by 50 move rule. ';
      } else if (chess.in_draw() && chess.insufficient_material()) {
        gameDrawn = true;
        finalComment = ' Draw by insufficent material. ';
      } else if (chess.in_checkmate()) {
        // check who moved last
        whiteWon = chess.history.length % 2 === 1; // odd means white moved last
        finalComment = ` ${whiteWon ? 'White' : 'Black'} wins by checkmate. `;
      } else if (chess.in_threefold_repetition()) {
        gameDrawn = true;
        finalComment = ' Draw by threefold repetition. ';
      }
      chess.set_comment(finalComment);
      const gameResult = gameDrawn ? '1/2-1/2' : whiteWon ? '1-0' : '0-1';
      chess.header(
        'Event',
        'Chess Game',
        'Date',
        dateToday,
        'White',
        game.white.address,
        'Black',
        game.black.address,
        'UTCDate',
        UTCDateToday,
        'UTCTime',
        `${currDate.getUTCHours()}:${currDate.getUTCMinutes()}:${
          currDate.getUTCSeconds.length === 1 ? '0' : ''
        }${currDate.getUTCSeconds()}`,
        'Result',
        gameResult,
      );
      // gameData.result = gameResult;
      // gameData.pgn = chess.pgn();
      const data = {
        result: gameResult,
        pgn: chess.pgn(),
      };

      const uploadedFiles = makeFileObjects(data);
      const uploadedFilesCID = storeFiles(uploadedFiles);

      return uploadedFilesCID;
      // ## save data to chain here and start minting.
      // }
    }

    return '';
  }

  const home = game[startColor];
  const opponent = game[opponentColor];

  // Size of the Chess Board
  const boardsize =
    Math.round((Math.min(window.innerWidth, window.innerHeight) * 0.8) / 8) * 8;

  // Get the color whose turn is
  const turnColor = () => (chess.turn() === 'w' ? 'white' : 'black');

  // Check which pieces can be moved and where
  const calcMovable = () => {
    const dests = new Map();
    if (isMyMove) {
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
      console.log(move?.from, move?.to);
    }
    setIsMyMove(true);
    updateLog();
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

    const allMoves = chess.history({ verbose: true });
    publishMove(code, from, to, allMoves);

    // if (chess.move({ from, to, promotion: 'q' })) {
    //   setFen(chess.fen());
    //   setLastMove([from, to]);
    //   setChecked(chess.in_check());
    //   setColor(turnColor());

    //   if (vsComputer) {
    //     setTimeout(randomMove, 500);
    //   } else {
    //     client.publish(code, {
    //       type: 'move',
    //       move: { from, to, promotion: 'q' },
    //       from: gameData[startColor].address,
    //       time: Date.now(),
    //       fen: chess.fen(),
    //     });
    //   }
    // }
    updateLog();
  };
  const formatTime = msecs => {
    const tenth = parseInt((msecs / 100) % 10, 10);
    let secs = parseInt((msecs / 1000) % 60, 10);
    let mins = parseInt(msecs / 60000 /* % 60 */, 10); // % 60 if using hours
    // let hours = parseInt((msecs / 3600000), 10);

    // hours = hours < 10 ? `0${hours}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    secs = secs < 10 ? `0${secs}` : secs;

    // return `${hours}:${mins}:${secs}.${tenth}`;
    return `${mins}:${secs}.${tenth}`;
  };

  const promotion = e => {
    const from = pendingMove[0];
    const to = pendingMove[1];

    chess.move({ from, to, promotion: e });
    setFen(chess.fen());
    setLastMove([from, to]);
    setSelectVisible(false);
    setChecked(chess.in_check());
    // setColor(turnColor());
    if (vsComputer) {
      setTimeout(randomMove, 500);
    } else {
      publishMove(code, from, to, chess.history({ verbose: true }));
    }
    updateLog();
  };
  // let i = 0;
  // useEffect(() => {
  //   const load = async () => {
  //     const sub = await client.resend(
  //       {
  //         stream:
  //           '0xDc9FC2d9aB39B4dE70Cbae0A095A2a7d2Cf75065/chess/1637481377673',
  //         from: {
  //           timestamp: 1637481377673,
  //         },
  //         partition: 1,
  //       },
  //       message => {
  //         console.log(i++, message);
  //       },
  //     );
  //   };

  //   load();
  // }, [lastMove]);

  // useEffect(() => {
  //   const create = async () => {
  //     const time = Date.now();
  // let ensDecoded = await provider.resolveName(friendAddress);
  // const stream = await client.createStream({
  // id: `${address}/game`,
  // game ID is starting time of game
  //   id: `${account}/chess/${time}`, // or address/foo/bar or mydomain.eth/foo/bar
  // });
  // await stream.addToStorageNode(StorageNode.STREAMR_GERMANY); // store data
  // everyone can get and subscribe to the stream (for spectating)
  // if (!(await stream.hasPermission('stream_get', null))) {
  //   await stream.grantPermission('stream_get', null);
  // }
  // if (!(await stream.hasPermission('stream_publish', ensDecoded))) {
  //   await stream.grantPermission('stream_publish', ensDecoded);
  // }
  //   if (!(await stream.hasPermission('stream_subscribe', null))) {
  //     await stream.grantPermission('stream_subscribe', null);
  //   }
  //   setCode(stream);
  // };
  // create();
  // }, []);

  useEffect(() => {
    // if (vsComputer) {
    //   setIsMyMove(true);
    // } else {

    client.subscribe(
      {
        stream: code,
      },
      (message, metadata) => {
        // note: will also receive own messages
        const msgTime = metadata.messageId.timestamp;
        const currTime = Date.now();
        const msgLatency = currTime - msgTime;

        console.log(message);
        console.log(metadata);

        if (message.type === 'move') {
          // if (!clockStarted.current) {
          // game.startTime = msgTime;
          // clockStarted.current = true; // start clock if not started
          //   console.log('game has started!');
          // }

          if (color !== turnColor()) {
            //  This Move was played by opponent
            const { move } = message;
            const { from, to, promotion } = move;
            const moves = chess.moves({ verbose: true }); // Returns a list of legal moves from the current position

            //  Check if promotion is possible
            for (let i = 0, len = moves.length; i < len; i += 1) {
              if (
                moves[i].flags.indexOf('p') !== -1 &&
                moves[i].from === from
              ) {
                setPendingMove([from, to]);
                if (turnColor() === startColor) {
                  setSelectVisible(true); // only person playing move can see promotion
                  return;
                }
              }
            }

            const moveResult = chess.move({ from, to, promotion });

            if (moveResult) {
              // move successful
              setFen(chess.fen());
              setLastMove([from, to]);
              setChecked(chess.in_check());
            }
            setIsMyMove(true); // can play now
            updateLog();
          } else {
            //  It was My Move
            setIsMyMove(false);
          }
        } else if (message.type === 'command') {
          // ## Add commands for resign and draw offered
          if (message.command === 'offer_draw') {
            // drawOffer.drawOffered = true;
          }
        }
        // now type could be join, start, ready
        else if (
          message.type === 'join' &&
          message.from.toLowerCase() !== home.address.toLowerCase()
        ) {
          const msg = {
            type: 'start',
            from: home.address,
            time: Date.now(),
          };
          client.publish(code, msg);
        } else if (message.type === 'start') {
          // Check if i am the first move
          if (startColor === 'white') {
            setIsMyMove(true);
          }
          setBothPlayersJoined(true);
          // ## Perform other steps like closing  modal.
          clockStarted.current = true;
          // Store or publish the time match begun.
          setMatchStartTime(new Date.now());
        }
      },
    );
    return function cleanup() {
      client.unsubscribe(code);
    };
  }, [code, color]);

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
      <div className="Moves">
        <div>Moves Box</div>
      </div>
    </div>
  );
}

export default Play;
