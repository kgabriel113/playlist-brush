import './App.css';
import React from "react";
import CanvasDraw from "react-canvas-draw";


function App() {
  const [collecting, setCollecting] = React.useState(false);
  var coordsList = [];

  const windowRef = React.useRef(); // add window ref
  // update window ref whenever window is updated
  React.useEffect(function setupListeners() {

    windowRef.current.addEventListener('mousemove', handleMove);
    windowRef.current.addEventListener('mousedown', handleDown);
    windowRef.current.addEventListener('mouseup', handleUp);

    return function cleanupListeners() {
      windowRef.current.removeEventListener('mousemove', handleMove);
      windowRef.current.removeEventListener('mousedown', handleDown);
      windowRef.current.removeEventListener('mouseup', handleUp);
    }

  }, [window, collecting]);

  const handleDown = (_) => {
    coordsList = [];
    setCollecting(true);
  }

  const handleUp = (_) => {
    console.log(coordsList)
    setCollecting(false);
  }

  const handleMove = (event) => {
    //if (collecting) console.log('beep')
    if(collecting) coordsList.push({ x: event.offsetX, y: event.offsetY });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div ref={windowRef}>
          <CanvasDraw />
        </div>
      </header>
    </div>
  );
}

export default App;
