import './App.css';
import {shuffle} from 'lodash';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';

function formatFieldFn(field, scale) {
  let result = []
  for (let i = 0; i < field.length; i += scale) {
    result.push(field.slice(i, i + scale))
  }
  return result
}

function App() {
  const [scale, setScale] = React.useState(2)
  const [field, setField] = React.useState([]) //double array
  console.log('field', field)
  const [zero, setZero] = React.useState([0, 0])
  console.log('zero', zero)
  const [won, setWon] = React.useState(false)

  function isSorted(field) {
    console.log('sorted field', field)
    if (field.length === 0) return false
    const arr = field.flat()
    for (let i = 0; i < arr.length - 2; i++) {
      if (arr[i + 1] - arr[i] !== 1) return false
    }
    if (arr[0] === 0) return false
    return true
  }


  React.useEffect(() => {
    if (isSorted(field)) {
      setWon(true)
    }
    console.log('field', field)
  }, [field])

  const onCellClick = (rowIndex, cellIndex) => {
    console.log('clicked', rowIndex, cellIndex)
    if (rowIndex === zero[0] && Math.abs(zero[1] - cellIndex) === 1 ||
      cellIndex === zero[1] && Math.abs(zero[0] - rowIndex) === 1) {
      [field[rowIndex][cellIndex], field[zero[0]][zero[1]]] =
        [field[zero[0]][zero[1]], field[rowIndex][cellIndex]]
      setField([...field])
      setZero([rowIndex, cellIndex])
    }
  }

  const buildField = () => {
//generate array for fields from 2 to scale squared minus one
    const fieldArray = shuffle(Array.from(Array(scale * scale).keys()))
    const formatField = formatFieldFn(fieldArray, scale)
    setField(formatField)
    setZero(findZero(formatField))
    setWon(false)
  }

  function findZero(arr) {
    const zero = [0, 0]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === 0) {
          zero[0] = i
          zero[1] = j
        }
      }
    }
    console.log('zero', zero)
    return zero
  }


  return (
    <div className="container">
      <h2>Tags</h2>
      <hr/>
      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="autoSizingInput">
          Put your scale number here: </label>
        <br/>
        <input type="number" className="form-control"
               aria-describedby="autoSizingInput" min='2' max='10'
               value={scale} onChange={(e) => setScale(+e.target.value)}/>
        <button type="button" className="btn btn-outline-success" id="autoSizingInput"
                onClick={buildField}> Build your board
        </button>
      </div>

      <hr/>
      {field.length > 0 &&
        <div>
          {field.map((row, rowIndex) =>
            (<div className="d-flex ">
              {row.map((cell, cellIndex) => (
                <div className="d-flex border justify-content-center align-items-center"
                     style={{width: "80px", height: "80px", cursor: "pointer"}}
                     onClick={() => onCellClick(rowIndex, cellIndex)}>
                  {cell === 0 ? '' : cell}
                </div>
              ))}
            </div>))}
        </div>
      }
      {won && <span style={{color: "green", fontSize: "50px"}}>You Won!</span>}
    </div>
  );
}

export default App;
