import './App.css';
import React from 'react'
import Popstar from './Popstar.js'
import data from '../Data/data'
import Confetti from 'react-confetti';
import { useState, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';



function App() {

  const {
    seconds,
    minutes,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: true });


  function populateArray() {
    let startArray = []
    for (let i = 0; i < 10; i++) {
      startArray.push({ ...data[Math.floor(Math.random() * 20)], id: i })
      //startArray[i].id = i
    }
    return startArray
  }

  function newPopstar(id) {
    return { ...data[Math.floor(Math.random() * 20)], id: id }
  }


  let startArray = populateArray();
  let endSeconds = 0;
  let endMinutes = 0;
  let score = 0;



  const [popArray, setPopArray] = useState(startArray)
  const [gameState, setGameState] = useState(false)
  const [gameStart, setGameStart] = useState(true)
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') === null ? 0 : parseInt(localStorage.getItem('highScore')))



  useEffect(() => {

    const allHeld = popArray.every(popStar => popStar.isHeld)
    const referencePop = popArray[0]
    const allName = popArray.every(popStar => popStar.name === referencePop.name)
    if (allHeld && allName) {
      setGameState(true)
      setGameStart(false)

    }
  }, [popArray])

  useEffect(() => {
    if (!gameStart) {
      pause()
      endSeconds = seconds;
      endMinutes = 60 * minutes;
      score = endSeconds + endMinutes;
      if (highScore === 0) {
        setHighScore(score)
        localStorage.setItem('highScore', JSON.stringify(score))
      } else if (score < highScore) {
        setHighScore(score)
        localStorage.setItem('highScore', JSON.stringify(score))
      }


    }
    else {
      reset()
      start()
    }
  }, [gameStart])

  function rollButton() {
    setGameStart(true)
    if (!gameState) {
      setPopArray(oldArray => oldArray.map((pop, index) => {
        return pop.isHeld ? pop : newPopstar(index)
      }))
    } else {
      setGameState(false)
      setPopArray(populateArray())
    }
  }

  function holdPop(id) {
    setPopArray(oldArray => oldArray.map(pop => {
      if (pop.id === id) {
        return { ...pop, isHeld: !pop.isHeld }
      } else {
        return pop
      }
    }))
  }

  function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = React.useState({
      width: undefined,
      height: undefined,
    });

    React.useEffect(() => {
      const handleResize = () =>
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });

      window.addEventListener('resize', handleResize);

      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return windowSize;
  };

  const { width, height } = useWindowSize()


  return (


    <div className="App">
      {gameState && <Confetti width={width} height={height}></Confetti>}
      <h1><a href='https://boards.4channel.org/mu/catalog' target="_blank">WPOP TENZIES</a></h1>
      <h2>1.- Click on a wpopstar to hold her (lol)</h2>
      <h2>2.- Hold 10 of the same wpopstar to win!</h2>
      <h2>3.- Try and beat your previous time.</h2>
      <div className='pop-container'>
        {popArray.map((popstar, index) => {
          return <Popstar imageURL={popstar.imageURL} isHeld={popstar.isHeld} id={index} key={index} holdPop={holdPop} />
        })}
      </div>
      <div className='button-div'>
        <button className="button-44" role="button" onClick={rollButton}>{gameState ? "New Game" : "ROLL"}</button><span>{minutes}{seconds < 10 ? `:0${seconds}` : `:${seconds}`} </span>
      </div>
      <div className='best-time'>
        Best Time: {fmtMSS(highScore)}
      </div>
    </div>
  );
}

export default App;
