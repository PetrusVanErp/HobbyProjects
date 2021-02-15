import React from "react";

import "../css/NotFound.css"

export default function NotFound(props) {
    return (
        <div className="NotFound">
          <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@600;900&display=swap" rel="stylesheet" />
          <div className="mainbox">
            <div className="err">404</div>
            <div className="msg">Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?<p>Let's go <a href="/">home</a> and try from there.</p></div>
          </div>
        </div>
    )
}