import React, {useState} from 'react';
import '../App.css';
import data from '../test_data/data'
import data2 from '../test_data/data2'
import {Pagination} from '@material-ui/lab'
import FileList from './FileList'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';

const Home = ( props ) => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [input, setInput] = useState("");

    const pageHandler = (event, value) => {
        setPage(value - 1);
    };

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input })
  };
  
    const inputTextHandler = (event) => {
        setInput(event.target.value);
    };
  
    const buttonHandler = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:3000/queries', requestOptions);
        setData(await response.json())
        setInput("");
    };
  
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
          <FileList pageNumber={page} data={data}/>
          <Pagination className="paging" size="large" color="primary" onChange={pageHandler} count={Math.ceil(data.length / 5)}/>
        </div>
    );
  }

  export default Home;