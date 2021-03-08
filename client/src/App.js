import React, {useState} from 'react';
import './App.css';
import data from './test_data/data'
import data2 from './test_data/data2'
import {Pagination} from '@material-ui/lab'
import FileList from './components/FileList'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';


function App() {

  var usingData = data

  const [page, setPage] = useState(0);
  const [input, setInput] = useState("");

  const pageHandler = (event) => {
    console.log(event);
    setPage(event.target.innerText - 1);
  }

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
      <FileList pageNumber={page} data={usingData}/>
      <Pagination className="paging" size="large" onChange={pageHandler} count={Math.ceil(usingData.length / 5)}/>
    </div>
  );
}

export default App;
