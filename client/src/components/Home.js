import React, {useEffect, useState} from 'react';
import '../App.css';
import {Pagination} from '@material-ui/lab'
import FileList from './FileList'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from '@material-ui/icons/Search';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';

const Home = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [input, setInput] = useState("");
    const [warning, setWarning] = useState(false);
    const [error, setError] = useState(false);

    const pageHandler = (event, value) => {
      setPage(value - 1);
    };

    useEffect(() => {
      getLocalData();
    }, []);

    useEffect(() => {
      // save to local storage
      localStorage.setItem("data", JSON.stringify(data));
    }, [data])

    useEffect(() => {
      // save to local storage
      localStorage.setItem("page", JSON.stringify(page));
    }, [page])

    // get local storage
    const getLocalData = () => {
      if (localStorage.getItem("data") == null){
        setData([]);
      }else{
        let dataLocal = JSON.parse(localStorage.getItem("data"));
        setData(dataLocal);
      }
      if (localStorage.getItem("page") == null){
          setPage(0)
      }else{
        setPage(JSON.parse(localStorage.getItem("page")));
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
        const jsonResponse = await response.json();
        if (response.status === 200){
          setData(jsonResponse);
        }
        else if (response.status === 406){
          setError((prev) => !prev)
          setTimeout(() => { setError(false) }, 1500);
        }
        else if (response.status === 404){
          setWarning((prev) => !prev)
          setTimeout(() => { setWarning(false); }, 1500);
        }
        await setInput("");
        await setPage(0);
    };
    return (
      <div className="App">
          <h1 className="project-name">Extended Boolean Model</h1>
          <form className="search-form" onSubmit={buttonHandler}>
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
          <Fade in={warning}>
            <Alert variant="filled" className="alert" 
            onClick={() => {setWarning((prev) => !prev)}} 
            onClose={() => {}}
            severity="warning">Expression was not found</Alert>
          </Fade>
          <Fade in={error}>
            <Alert variant="filled" className="alert" 
            onClick={() => {setError((prev) => !prev)}} 
            onClose={() => {}}
            severity="error">Expression is empty or typed incorrectly</Alert>
          </Fade>
          <FileList pageNumber={page} data={data}/>
          <Pagination page={page + 1} className="paging" size="large" color="primary" onChange={pageHandler} count={Math.ceil(data.length / 5)}/>
        </div>
    );
  }

  export default Home;