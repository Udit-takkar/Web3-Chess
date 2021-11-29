import React, { createContext, useContext } from 'react';

export const ClockContext = createContext();

export const useClock = () => useContext(ClockContext);

const initialState = {
  running: false,
  isTimeOver: false,
  currentClock: '',
  whiteTime: 180000,
  blackTime: 180000,
};

const actions = {
  SWITCH_CLOCK: 'SWITCH_CLOCK',
  STOP_CLOCK: 'STOP_CLOCK',
  CLOCK_TICK: 'CLOCK_TICK',
  TIME_OVER: 'TIME_OVER',
  SET_TIME: 'SET_TIME',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SWITCH_CLOCK: {
      const clockState = Object.assign({}, state);
      clockState.currentClock =
        state.currentClock !== 'blackTime' ? 'blackTime' : 'whiteTime';
      clockState.running = true;
      return clockState;
    }
    case actions.STOP_CLOCK: {
      const clockState = Object.assign({}, state);
      if (clockState.running) {
        clockState.currentClock =
          state.currentClock !== 'blackTime' ? 'blackTime' : 'whiteTime';
      }
      clockState.running = false;
      return clockState;
    }
    case actions.TIME_OVER: {
      const clockState = Object.assign({}, state);
      clockState.running = false;
      clockState.isTimeOver = true;
      return clockState;
    }
    case actions.SET_TIME: {
      const clockState = Object.assign({}, state);
      clockState.isTimeOver = false;
      clockState.running = false;
      clockState.whiteTime = action.time;
      clockState.blackTime = action.time;
      return clockState;
    }
    case actions.CLOCK_TICK: {
      const clockState = Object.assign({}, state);
      if (clockState.isTimeOver === false) {
        const playerTime = clockState[clockState.currentClock];
        clockState[clockState.currentClock] = playerTime - 1000;
      }
      return clockState;
    }
    default:
      return state;
  }
};
const clockTick = () => ({
  type: actions.CLOCK_TICK,
});

export const ClockContextProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  let timeInterval = null;
  const value = {
    whiteTime: state.whiteTime,
    blackTime: state.blackTime,
    startClock: () => {
      clearInterval(timeInterval);
      timeInterval = setInterval(() => dispatch(clockTick()), 1000);
      dispatch({
        type: actions.SWITCH_CLOCK,
      });
      dispatch(clockTick());
    },
    stopClock: () => {
      clearInterval(timeInterval);
      return {
        type: actions.STOP_CLOCK,
      };
    },
    timeOver: () => {
      clearInterval(timeInterval);
      return {
        type: actions.TIME_OVER,
      };
    },
  };
  return (
    <ClockContext.Provider value={value}>{children}</ClockContext.Provider>
  );
};
