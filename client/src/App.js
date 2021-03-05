import React, {useState} from 'react';
import './App.css';
import FileList from './components/FileList'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';


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
      <TextField className="search-bar"  label="Type expression..." value={input} onChange={inputTextHandler}
                variant="outlined"
                InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <IconButton onClick={buttonHandler}>
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
            />
      </form>
      <FileList />
    </div>
  );
}

export default App;
