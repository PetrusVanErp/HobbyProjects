import React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {logIn, redirect} from "./actions";
import './App.css';
import {saveUserCode} from "./components/connections/SpotifyHandler";
import CreatePlaylistComponent from "./components/CreatePlaylistComponent";
import EditPlaylistComponent from "./components/EditPlaylistComponent";
import EditProfileComponent from "./components/EditProfileComponent";
import FooterComponent from "./components/FooterComponent";
import FriendsListComponent from "./components/FriendsListComponent";
import HeaderComponent from "./components/HeaderComponent";
import HomeScreenComponent from "./components/HomeScreenComponent";
import LoginComponent from "./components/LoginComponent";
import NotFoundComponent from "./components/NotFoundComponent";
import PlaylistComponent from "./components/PlaylistComponent";
import PlaylistOverviewComponent from "./components/PlaylistOverviewComponent";
import ProfileComponent from "./components/ProfileComponent";
import RegisterComponent from "./components/RegisterComponent";
import SearchComponent from "./components/SearchComponent";
import EditPasswordComponent from "./components/EditPasswordComponent";
import SettingsComponent from "./components/SettingsComponent";
import {getLoggedInUser} from "./websockets/serverCommunication";
import FriendsPageComponent from "./components/FriendsPageComponent";


function App(props) {

    const link = "http://localhost:3000"
    let title = "T-Vibe"

    const getComponentByPage = (page = props.currentPage) => {
        //Default redirect if not logged in
        if (page !== "REGISTER" && props.activeUser === null)
            page = "LOGIN"

        switch (page) {
            case "HOMEPAGE":
                title += ' | Home'
                return <HomeScreenComponent/>
            case "CREATE_PLAYLIST":
                title += ' | New playlist'
                return <CreatePlaylistComponent/>
            case "VIEW_PLAYLIST":
                title += ' | Playlist'
                return <PlaylistComponent/>
            case "EDIT_PLAYLIST":
                title += ' | Edit playlist'
                return <EditPlaylistComponent/>
            case "MY_PLAYLISTS":
                title += ' | Playlists'
                return <PlaylistOverviewComponent/>
            case "MY_FRIENDS":
                title += ' | Friends'
                return <FriendsListComponent/>
            case "PROFILE" :
                title += ' | Friendpage'
                return <FriendsPageComponent/>
            case "MY_PROFILE":
                title += ' | Profile'
                return <ProfileComponent/>
            case "EDIT_PROFILE":
                title += ' | Edit profile'
                return <EditProfileComponent/>
            case "EDIT_PASSWORD":
                title += ' | Edit password'
                return <EditPasswordComponent/>
            case "REGISTER":
                title += ' | Register'
                return <RegisterComponent/>
            case "LOGIN":
                title += ' | Login'
                return <LoginComponent/>
            case "SETTINGS":
                title += ' | Settings'
                return <SettingsComponent/>
            case "SEARCH":
                title += ' | Search'
                return <SearchComponent/>
            default:
                return <NotFoundComponent/>
        }
    }

    //Handles the spotify authorization redirect
    async function redirectSpotify(url) {
        await saveUserCode(await getLoggedInUser(), url)
        await getLoggedInUser().then((result) => {
            props.logIn(result)
        })
        window.history.pushState("", "", link)

    }

    if (window.location.href.includes(link + '/spotify-api')) {
        redirectSpotify(window.location.href)
    }

    return (
        <React.Fragment>
            <div className="App">
                <HeaderComponent/>
                {getComponentByPage()}
                <FooterComponent/>
            </div>
            <title>{title}</title>
        </React.Fragment>
    )
}

function mapStateToProps(state) {
    return {
        activeUser: state.activeUser,
        currentPage: state.currentPage
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({logIn: logIn, redirect: redirect}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);
