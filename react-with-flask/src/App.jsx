import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [currentTime, setCurrentTime] = useState(0);

  // // creates a new side effect that is going to run automatically when the component renders to the page
  // useEffect(() => {
  //   fetch('/api/time').then(res => res.json()).then(data => {
  //     setCurrentTime(data.time);
  //   });
  // }, []); // [] : no dependencies, so it only runs once when the component is first rendered
  
  const fetchTime = () => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }

  return (
    <>
      <p>The current time is {new Date(currentTime * 1000).toLocaleString()}.</p>
      <button onClick={fetchTime}>Refresh Time</button>
    </>
  )
}

export default App
