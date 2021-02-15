import React from "react";

import {bindActionCreators} from "redux";
import {redirect} from "../actions";
import {connect} from "react-redux";
import CreatePlaylistComponent from './CreatePlaylistComponent';

function EditPlaylistComponent(props) {
    return (<CreatePlaylistComponent trackIDs={props.trackIDs}
                                     saveTracks={props.saveTracks}
                                     updatePlaylist={props.updatePlaylist}/>)
}
function mapStateToProps(state) {
    return {
        selectedPlaylist: state.selectedPlaylist
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({redirect: redirect}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(EditPlaylistComponent);
