import React from 'react';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay';


const Content = ( props ) => {
    let content = [{content: ""}]
    if (localStorage.getItem("data") != null){
        let dataLocal = JSON.parse(localStorage.getItem("data"));
        content = dataLocal.filter(file => file.file === props.match.params.id + ".txt");
    }
   
    return (
        <div className="content">
            <p>{content[0].content}</p>
            <Link className="link" to={{pathname:'/'}}  >
                <Button variant="contained" size="large" startIcon={<ReplayIcon/>}>Back
                    <li className="link"/>
                </Button>
            </Link>
        </div>
    );
};

export default Content;