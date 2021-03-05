import React, {useState} from 'react';
import './App.css';
import FileList from './components/FileList'

function App() {

  const [input, setInput] = useState("");

  const inputTextHandler = (event) => {
    setInput(event.target.value);
  };

  const buttonHandler = (e) => {
    e.preventDefault();
    console.log(input);
    setInput("");
  }

  return (
    <div className="App">
      <form className="search-form">
        <input onChange={inputTextHandler} className="search-bar" type="text" value={input} placeholder="Type expression..."/>
        <button className="search-button" onClick={buttonHandler}>Search</button>
      </form>
      <FileList />
    </div>
  );
}

export default App;
