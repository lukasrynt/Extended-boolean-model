import React, {useEffect, useState} from 'react';
import '../App.css';
import {Pagination} from '@material-ui/lab'
import FileList from './FileList'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';

const Home = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [input, setInput] = useState("");

    const pageHandler = (event, value) => {
      setPage(value - 1);
    };

    useEffect(() => {
      getLocalData();
    }, []);

    useEffect(() => {
      saveLocalData();
    }, [data])

    // save to local storage
    const saveLocalData =  () => {
      localStorage.setItem("data", JSON.stringify(data));
    };
    // get local storage
    const getLocalData = () => {
      if (localStorage.getItem("data") == null){
        setData([]);
      }else{
        let dataLocal = JSON.parse(localStorage.getItem("data"));
        setData(dataLocal);
      }
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
        const response = await fetch('http://localhost:5000/queries', requestOptions);
        setData(await response.json())
        await setInput("");
        await setPage(0);
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
          <Pagination page={page + 1} className="paging" size="large" color="primary" onChange={pageHandler} count={Math.ceil(data.length / 5)}/>
        </div>
    );
  }

  export default Home;