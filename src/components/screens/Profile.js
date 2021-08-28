import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  console.log(state);
  const [mypics, setmypics] = useState([]);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setmypics(result.myposts);
      });
  }, []);

  useEffect(() => {
    if (image) {
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

           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
           })
        })
        .catch(err=>{
            console.log(err)
        })
       }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            alt="profile"
            style={{
              width: "160px",
              marginLeft: "100px",
              marginTop: "25px",
              height: "160px",
              borderRadius: "80px",
              marginBottom: "10px",
            }}
            src={state ? state.pic : ""}
          />
        </div>
        <div className="user-pro" style={{ marginLeft: "-700px", marginRight: "-100px" }}>
          <h4>{state ? state.name : "Loading"}</h4>
          <h5>{state.email}</h5>
          <div
            style={{
              display: "flex",
              width: "108%",
              justifyContent: "space-between",
            }}
          >
            <h6>{mypics.length} posts</h6>
          </div>
          <div>
            <div className="file-field input-field">
              <div className="btn">
                <span>Update Profile picture</span>
                <input
                  type="file"
                  onChange={(e) => updatePhoto(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => {
          return <img className="item" alt="post" src={item.photo} />;
        })}
      </div>
    </div>
  );
};

export default Profile;