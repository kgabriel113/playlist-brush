import './App.css';
import React from "react";
import CanvasDraw from "react-canvas-draw";
import Button from 'react-bootstrap/Button';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ListPanel from './ListPanel';


function App() {
  const [collecting, setCollecting] = React.useState(false);
  const [isLinear, setIsLinear] = React.useState(true);
  const [storedLine, setStoredLine] = React.useState([]);
  const [results, setResults] = React.useState([]);
  var coordsList = [];

  const canvasRef = React.useRef();

  const windowRef = React.useRef(); // add window ref
  // update window ref whenever window is updated
  React.useEffect(function setupListeners() {

    const handleDown = (_) => {
      canvasRef.current.clear();
      coordsList = [];
      setCollecting(true);
    }
  
    const handleUp = (_) => {
      console.log(coordsList);
      setStoredLine(coordsList);
      setCollecting(false);
    }
  
    const handleLinearMove = (event) => {
      if(collecting) {
        coordsList.push({ x: event.offsetX, y: 400 - event.offsetY });
      }
    }

    const handlePeriodicMove = (event) => { 
      if(collecting) {
        const previousLength = coordsList.length
        const distanceToCenter = ((200-event.offsetX)**2 + (200-event.offsetY)**2)**0.5 //distance formula
        coordsList.push({ x: previousLength, y: distanceToCenter});
      }
    }

    const moveFunction = isLinear ? handleLinearMove : handlePeriodicMove
    windowRef.current.addEventListener('mousemove', moveFunction);
    windowRef.current.addEventListener('mousedown', handleDown);
    windowRef.current.addEventListener('mouseup', handleUp);

    return function cleanupListeners() {
      windowRef.current.removeEventListener('mousemove', moveFunction);
      windowRef.current.removeEventListener('mousedown', handleDown);
      windowRef.current.removeEventListener('mouseup', handleUp);
    }

  }, [collecting, isLinear]);

  const onClearClick = () => {
    canvasRef.current.clear();
    setStoredLine([]);
    setResults([]);
  }

  const onPostClick = () => {
    if(storedLine.length < 1) alert("no data to post!")
    else {
      axios
        .post("https://conductor-brush-api.herokuapp.com/playlist/generate/", {"list": storedLine}) //https://conductor-brush-api.herokuapp.com //http://localhost:8000/playlist/generate/
        .then(res => {
          console.log(res.data.playlist);
          setResults(res.data.playlist);
        }).catch(err => console.log(err)); 
    }
  }

  const updateMode = (newModeLinear) => {
    onClearClick()
    setIsLinear(newModeLinear)
  }

  return (
    <div className="App">
      <header className="App-header">
          <h1>Draw tempo playlist</h1>
          <div style={{display: "flex", flexDirection: "row", overflow: "hidden"}}>
            <div style={{display: "flex", flexDirection: "column"}}>
            <div ref={windowRef} style={{paddingBottom: 15}}>
              <CanvasDraw ref={canvasRef} />
            </div>
            <div style={{display: "flex", flexDirection: "row"}}>
              <ToggleButtonGroup type="radio" name="options" defaultValue={1} style={{marginRight: 10}}>
                <ToggleButton className="shadow-none" id="tbg-radio-1" value={1} onClick={() => updateMode(true)}>Linear</ToggleButton>
                <ToggleButton className="shadow-none" id="tbg-radio-2" value={2} onClick={() => updateMode(false)}>Periodic</ToggleButton>
              </ToggleButtonGroup>
              <Button variant="secondary" onClick={onClearClick} style={{marginRight: 10}}>Clear</Button>
              <Button variant="primary" onClick={onPostClick}>Generate playlist</Button>
            </div>
          </div>
          {results.length > 1 && 
            <ListPanel playlist={results}/>}
          </div>
          
      </header>
    </div>
  );
}

export default App;
