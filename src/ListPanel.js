import PlaylistItem from './PlaylistItem';
import React from 'react';


function ListPanel(props) {

    return(
        <div style={{marginLeft: 10, backgroundColor: '#a9a9a9', flexDirection: "column", overflow: "auto", maxHeight: 400, borderRadius: 10}}>
            {props.playlist.map((item, index) => <PlaylistItem key={index} songName={item.title} artist={item.artist}/>)}         
        </div>
    );
}

export default ListPanel;
