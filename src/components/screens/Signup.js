import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  //creating states to sync
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  useEffect(() => {
    if (url) {
      uploadField();
    }
  }, [url])

  const uploadPic = ()=> {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "sma-images");
    data.append("cloud_name", "gjcloud");
    fetch("https://api.cloudinary.com/v1_1/gjcloud/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const uploadField = ()=>{
    if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && email) {
      M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
      return;
    }
    fetch("/signup", {
      //fetching the path and making HTTP request using arguments
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        pic:url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({ html: data.message, classes: "#00FF00 green darken-3" });
          history.push("/signin"); //history is used to jump to next task after prev task done.
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const PostData = () => {
    if(image) {
      uploadPic();
    }
    else {
      uploadField();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h2>Sma</h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

        <div className="file-field input-field">
          <div className="btn">
            <span>Select Profile picture</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button
          className="btn waves-effect waves-light btn-signin"
          onClick={() => PostData()}
        >
          Sign Up
        </button>
        <h5 className="link-to-page">
          <Link to="/signin">Already have an account? Signin here</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
