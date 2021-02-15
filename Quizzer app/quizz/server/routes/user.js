const express = require("express");

const router = express.Router();

// Here we set up the session, but only if the password is correct.
router.post("/login", (req, res) => {
  if (req.body.password !== "password") {
    // not great security ;-)
    res.status(401).send("password invalid."); // reject login attempt
    return;
  }
  console.log(`Updating session for user ${req.body.userName}`);
  req.session.userName = req.body.userName;
  req.session.messageCounter = 0;
  res.send({ result: "OK", message: "Session updated" });
});

// Logging out clears out the session.
// Calling req.session.destroy does not work here.
router.delete("/logout", (request, response) => {
  console.log("Clearing out session for", request.session.userName);

  // Don't call request.session.destroy() to clear the session: When a new
  // session is created in '/login', that new session object will not be seen by
  // the callbacks for websocket messages.
  // Therefore, we're removing contents from the session-object, but keeping the session object itself intact.
  delete request.session.userName;
  delete request.session.messageCounter;
  response.send({ result: "OK", message: "Session cleared" });
});

module.exports = router;
