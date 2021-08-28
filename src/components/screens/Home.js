import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  console.log(data);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);

  const likepost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unlikepost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        document.getElementById("myform").reset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletepost = (postid)=> {
    fetch(`/deletepost/${postid}`, {
      method:"delete",
      headers:{
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      }
    }).then(res=>res.json())
    .then(result=>{
      console.log(result);
      const newData = data.filter(item=>{
        return item._id !== result._id
      })
      setData(newData);
    })
    .catch(err=>{
      console.log(err);
    });
  }

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 className="usr-name-post"><Link style={{color:"black"}} to={item.postedBy._id !== state._id ? "/profile/"+item.postedBy._id : "/profile"}> {item.postedBy.name}</Link> </h5>
            {item.postedBy._id === state._id && <i style={{float:"right", marginTop:"-40px", marginRight:"10px", cursor:"pointer"}} class="material-icons" onClick={()=>deletepost(item._id)}>delete</i>} 
            <div className="card-image post-img">
              <img src={item.photo} alt="post" />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (  //using ter cond to fetch like n dislike button
                <i
                  className="material-icons"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    unlikepost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    likepost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}
              <h6>{item.likes.length} Likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>
              {item.comments.map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight:"800" }}>
                      {record.postedBy.name}
                    </span>{" "}
                    {record.text}
                  </h6>
                );
              })}
              <form id="myform"
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="Add comment" />
                
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;