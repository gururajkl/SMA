import React, { useState, useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import M from 'materialize-css';
import {UserContext} from "../../App";

const Login = () => {
  //creating states to sync
  const history = useHistory();
  const [password, setPassword] = useState("");
  const {token} = useParams()

  const PostData = () => {
    fetch("/new-password", {
      //fetching the path and making HTTP request using arguments
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        token
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html:data.message, classes: "#00FF00 green darken-3" });
          history.push("/signin"); //history is used to jump to next task after prev task done.
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Sma</h2>
        <input
          type="password"
          placeholder="Enter New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light btn-signin"
          onClick={() => PostData()}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default Login;