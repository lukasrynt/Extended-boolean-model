import React from 'react';
import data from '../test_data/data'
import File from './File'
import '../App.css';

const FileList = () => {
    return (
        <div className="file-list">
            {data.map(data =>(
                <File text={data}/>
            ))}
        </div>
    )
};

export default FileList;