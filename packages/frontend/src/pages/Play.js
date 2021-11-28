import React, { useState, useEffect, useContext, useRef } from 'react';
import Chess from 'chess.js';
import Chessground from 'react-chessground';
import { Web3Context } from '../contexts/Web3Context';
import { makeFileObjects, storeFiles } from '../utils/web3storage';
import Clock from '../components/Clock';
import { useClock } from '../contexts/ClockContext';
import Promotion from '../components/modal/Promotion';
import EndGame from '../components/modal/EndGame';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';

import '../styles/chessground.css';
import '../styles/chessboard.css';

// ## pass code && game data from context
function Play({ startColor, vsComputer }) {
  const navigate = useNavigate();

  const { connectAccount, loading, account, disconnect, client } =
    useContext(Web3Context);
  const isClockStarted = useRef(false);
  const [code, setCode] = useState(
    '0xDc9FC2d9aB39B4dE70Cbae0A095A2a7d2Cf75065/chess/1637481377673',
  );
  const { state } = useLocation();

  const { whiteTime, blackTime, startClock } = useClock();
  const [chess] = useState(new Chess());
  const [haveBothPlayerJoined, setBothPlayersJoined] = useState(false);
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
    code: null,
    white: {
      address: null,
      remainingTime: 10,
    },
    black: {
      address: '0x759bacE429553bCA40645Da3283de1A105531b11',
      remainingTime: 10,
    },
  });
  const [trackMoves, setMoves] = useState([]);
  const [isEndGameModalOpen, setEndGameModalOpen] = useState(false);

  const opponentColor = startColor === 'white' ? 'black' : 'white';

  const home = game[startColor];
  const opponent = game[opponentColor];

  const publishMove = async (code, from, to, moves) => {
    console.log('Kuch toh hua hain');
    return client.publish(code, {
      type: 'move',
      move: { from, to },
      from: game[startColor].address,
      time: Date.now(),
      fen: chess.fen(),
      moves,
    });
  };

  async function updateLog() {
    console.log('chal le bhai');
    startClock();

    const moves = chess.history();
    setMoves(prevMoves => [...prevMoves, moves[moves.length - 1]]);
    const gamePgn = chess.pgn();
    // This pgn has to be saved
    setPgn(gamePgn);

    if (chess.in_threefold_repetition()) {
      // drawOffer.drawOffered = true; // draw offer extended to both players if in 3-fold rep
      //  ### End this Match Here and return
    }

    if (
      chess.game_over() ||
      game[startColor].remainingTime <= 0 ||
      game[opponentColor].remainingTime <= 0
    ) {
      let winnerAddress = null;
      let finalComment = '';
      let isMatchDrawn = false;

      if (game[startColor].remainingTime <= 0) {
        winnerAddress = game[opponentColor].address;
        finalComment = ` ${winnerAddress} wins on time. `;
        chess.header('Termination', 'Time forfeit');
      } else if (game[opponentColor].remainingTime <= 0) {
        winnerAddress = game[startColor].address;
        finalComment = ` ${winnerAddress} wins on time. `;
        chess.header('Termination', 'Time forfeit');
      } else if (chess.in_stalemate()) {
        isMatchDrawn = true;
        finalComment = ' Draw by stalemate. ';
      } else if (chess.in_draw() && !chess.insufficient_material()) {
        isMatchDrawn = true;
        finalComment = ' Draw by 50 move rule. ';
      } else if (chess.in_draw() && chess.insufficient_material()) {
        isMatchDrawn = true;
        finalComment = ' Draw by insufficent material. ';
      } else if (chess.in_checkmate()) {
        if (chess.history.length % 2 === 1) {
          winnerAddress = game['white'].address;
        } else {
          winnerAddress = game['black'].address;
        }
        finalComment = ` ${winnerAddress} wins by checkmate. `;
      } else if (chess.in_threefold_repetition()) {
        isMatchDrawn = true;
        finalComment = ' Draw by threefold repetition. ';
      }

      chess.set_comment(finalComment);

      chess.header(
        'Event',
        'Chess Game',
        'Date',
        Date.now(),
        'White',
        game.white.address,
        'Black',
        game.black.address,
        'Result',
        isMatchDrawn ? 'Match Drawn' : `${winnerAddress} won the match`,
      );

      const movesPlayed = chess.history();
      const data = {
        game,
        pgn: chess.pgn(),
        moves: movesPlayed,
      };

      const uploadedFiles = makeFileObjects(data);
      const uploadedFilesCID = storeFiles(uploadedFiles);
      //  Save to Chain here

      //  Start End game here
      if (
        !vsComputer &&
        winnerAddress.toLowerCase() === home.address.toLowerCase()
      ) {
        setEndGameModalOpen(true);
      }
    }

    return '';
  }

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

  //  Random Move for Computer
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

  const onMove = async (from, to) => {
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

    const allMoves = chess.history({ verbose: true }) ?? [];
    // await publishMove(code, from, to, allMoves);

    if (chess.move({ from, to, promotion: 'q' })) {
      setFen(chess.fen());
      setLastMove([from, to]);
      setChecked(chess.in_check());
      setColor(turnColor());
      if (vsComputer) {
        setTimeout(randomMove, 500);
      } else {
        await publishMove(code, from, to, allMoves);
      }
    }
    updateLog();
  };

  const promotion = async e => {
    const from = pendingMove[0];
    const to = pendingMove[1];

    chess.move({ from, to, promotion: e });
    setFen(chess.fen());
    setLastMove([from, to]);
    setSelectVisible(false);
    setChecked(chess.in_check());
    setColor(turnColor());
    if (vsComputer) {
      setTimeout(randomMove, 500);
    } else {
      await publishMove(code, from, to, chess.history({ verbose: true }));
    }
    updateLog();
  };

  useEffect(() => {
    // if (vsComputer) {
    //   setIsMyMove(true);
    // } else {
    if (!state) {
      navigate('/');
    } else {
      client.subscribe(
        {
          stream: code,
        },
        (message, metadata) => {
          // note: will also receive own messages
          const msgTime = metadata.messageId.timestamp;
          console.log(message);
          console.log(metadata);

          if (message.type === 'move') {
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
            // Store or publish the time match begun.
            setMatchStartTime(new Date.now());
          }
        },
      );
    }
    return function cleanup() {
      client.unsubscribe(code);
    };
  }, [code, color]);
  return (
    <div className="flex items-center justify-center mt-16 w-full">
      <div className="flex flex-col">
        <div id="opponent-timer" className="flex justify-between">
          <h1>{opponent.address}</h1>
          <Clock
            playerTime={opponentColor === 'white' ? whiteTime : blackTime}
          />
        </div>
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
        <div className="flex justify-between">
          <h1>{home.address}</h1>
          <Clock playerTime={startColor === 'white' ? whiteTime : blackTime} />
        </div>
      </div>
      {selectVisible && <Promotion promotion={promotion} />}
      {isEndGameModalOpen && (
        <EndGame setOpen={setEndGameModalOpen} opponent={opponent.address} />
      )}
      <div className="self-start w-1/5">
        <h1 className="text-center">Moves</h1>
        <div
          style={{ maxHeight: `${boardsize}` }}
          className="grid grid-cols-2 gap-4 text-center overflow-y-scroll"
        >
          {trackMoves?.map(move => {
            return <div key={uuidv4()}>{move}</div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default Play;
