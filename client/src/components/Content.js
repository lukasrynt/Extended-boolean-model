import React from 'react';
import data from '../test_data/data'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay';


const Content = ( props ) => {
    let text = props.location.text;
    let data = props.location.data.data;
    console.log(data)
    return (
        <div className="content">
            <h3 >{text.text}</h3>
            <Link className="link" to={{pathname:'/', data:{data}}}  >
                <Button variant="contained" size="large" startIcon={<ReplayIcon/>}>Back
                    <li className="link"></li>
                </Button>
            </Link>
        </div>
    );
};

export default Content;