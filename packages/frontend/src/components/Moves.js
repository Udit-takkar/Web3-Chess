import React from 'react';
import { v4 as uuidv4 } from 'uuid';

function Moves({ boardSize, trackMoves }) {
  return (
    <div>
      <h1 className="text-center">Moves</h1>
      <div
        style={{ maxHeight: `${boardSize}px` }}
        className="grid grid-cols-2 gap-4 text-center overflow-y-scroll "
      >
        {trackMoves?.map(move => {
          return <div key={uuidv4()}>{move}</div>;
        })}
      </div>
    </div>
  );
}

// export default Moves;
export const MemoizedMoves = React.memo(Moves);
