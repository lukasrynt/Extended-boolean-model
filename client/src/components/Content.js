import React from 'react';
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import ReplayIcon from '@material-ui/icons/Replay';


const Content = ( props ) => {
    let text = props.location.text;
    let data = props.location.data.data;
    return (
        <div className="content">
            <p>{text.text}</p>
            <Link className="link" to={{pathname:'/', data:{data}}}  >
                <Button variant="contained" size="large" startIcon={<ReplayIcon/>}>Back
                    <li className="link"/>
                </Button>
            </Link>
        </div>
    );
};

export default Content;