import {combineReducers} from "redux";
import SelectedPlaylistReducer from "./SelectedPlaylistReducer";
import CurrentPageReducer from "./CurrentPageReducer";
import ActiveUserReducer from "./ActiveUserReducer";
import GetPlaylistsReducer from "./GetPlaylistsReducer";
import FriendsReducer from "./FriendsReducer";
import WebSocketReducer from "./WebSocketReducer";
import FriendReducer from "./FriendReducer";

const allReducers = combineReducers({
    getPlaylists: GetPlaylistsReducer,
    selectedPlaylist: SelectedPlaylistReducer,
    currentPage: CurrentPageReducer,
    activeUser: ActiveUserReducer,
    friends: FriendsReducer,
    friend: FriendReducer,
    webSocket: WebSocketReducer
})

export default allReducers;
