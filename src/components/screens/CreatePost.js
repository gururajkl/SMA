import React, { useState, useEffect } from "react";
import M from "materialize-css";
import {useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImg] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {  //use effect is used here to fetch only if URL state is updated
    if (url) {
      fetch("/createpost", {
        //fetching the path and making HTTP request using arguments
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Posted successfully",
              classes: "#00FF00 green darken-3",
            });
            history.push("/"); //history is used to jump to next task after prev task done.
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);

  const Postdetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "sma-images");
    data.append("cloud_name", "gjcloud");
    fetch("https://api.cloudinary.com/v1_1/gjcloud/image/upload", {  //cloudinary API for uploading files
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
  };

  return (
    <div
      className="card input-filed"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn">
          <span>Select Image</span>
          <input type="file" onChange={(e) => setImg(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light btn-signin"
        onClick={() => Postdetails()}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePost;