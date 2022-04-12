

function PlaylistItem(props) {
    return(
        <div style={{margin: 5, justifyContent: "center", borderBottomWidth: 1, borderBottomColor: "black"}} >
            <p className="Title-text">{props.songName}</p>
            <p className="Artist-text">{props.artist}</p>
        </div>
    );
}
export default PlaylistItem;