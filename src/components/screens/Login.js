import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from 'materialize-css';
import {UserContext} from "../../App";

const Login = () => {
  const {state, dispatch} = useContext(UserContext);
  //creating states to sync
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      ) &&
      email
    ) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("/signin", {
      //fetching the path and making HTTP request using arguments
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({type:"USER", payload:data.user});
          M.toast({ html:"SignedIn success", classes: "#00FF00 green darken-3" });
          history.push("/"); //history is used to jump to next task after prev task done.
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
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light btn-signin"
          onClick={() => PostData()}
        >
          Log In
        </button>
        <h5 className="link-to-page">
          <Link to="/signup">Don't have an account? create one.</Link>
        </h5>
        <h6 className="link-to-page">
          <Link to="/reset">Forgot Password?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;