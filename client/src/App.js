import React, {useEffect, useState} from 'react';
import './App.css';

function App() {

  const [input, setInput] = useState("")

  const inputTextHandler = (event) => {
    setInput(event.target.value)
  }

  return (
    <div className="App">
      <form>
        <input onChange={inputTextHandler} className="search-bar" type="text" value={input}/>
        <button className="search-button">Search</button>
      </form>
      <h1>{input}</h1>
    </div>
  );
}

export default App;
