import React, { useRef, useEffect } from 'react';

const parseTime = miliseconds => {
  const tenthSecond = parseInt((miliseconds / 100) % 6, 10);
  let seconds = parseInt((miliseconds / 1000) % 60, 10);
  let minutes = parseInt(miliseconds / (1000 * 60), 10 % 60);
  let hours = parseInt(miliseconds / (1000 * 60 * 60), 10 % 24);

  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${minutes}:${seconds}:${tenthSecond}`;
};

function Clock({ playerTime }) {
  const time = useRef(parseTime(playerTime));
  useEffect(() => {
    if (playerTime <= 0) {
      time.current = 0;
    } else {
      time.current = parseTime(playerTime);
    }
  }, [playerTime]);

  return (
    <div className="font-montserrat w-24 p-2 bg-play-comp-color border-play-hand-btn text-xl border-2 ">
      {time.current}
    </div>
  );
}

export default React.memo(Clock);
