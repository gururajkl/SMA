import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App.js";
import M from "materialize-css";

const Navbar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems, {edge: 'left',
      draggable: true,
      inDuration: 250,
      outDuration: 200,
      onOpenStart: null,
      onOpenEnd: null,
      onCloseStart: null,
      onCloseEnd: null,
      preventScrolling: true});
    });
    if (state) {
      return [
        <li key="2" className="nav-sides">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3" className="nav-sides">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4" className="nav-sides LINK">
          <button
            style={{ marginBottom: "13px", marginLeft: "10px" }}
            className="btn waves-effect waves-light btn-signin btn-logout"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
            }}
          >
            LOGOUT
          </button>
        </li>,
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ marginLeft: "30px", cursor: "pointer" }}
          >
            search
          </i>
        </li>,
      ];
    } else {
      return [
        <li key="5" className="nav-sides">
          <Link to="/signup">Sign Up</Link>
        </li>,
        <li key="6" className="nav-sides">
          <Link to="/signin">Sign In</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <div className="navbar-fixed">
      <nav>
        <div className="nav-wrapper">
          <Link to={state ? "/" : "/signin"} className="brand-logo right">
            Social media app
          </Link>
          <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
        <div class="nav-content">
        </div>
        <div
          id="modal1"
          className="modal"
          ref={searchModal}
          style={{ color: "black" }}
        >
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search Users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection" style={{ color: "black" }}>
              {userDetails.map((item) => {
                return (
                  <Link
                    to={
                      item._id !== state._id
                        ? "/profile/" + item._id
                        : "/profile"
                    }
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch("");
                    }}
                  >
                    <li style={{ color: "black" }} className="collection-item">
                      {item.email}
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => setSearch("")}
            >
              close
            </button>
          </div>
        </div>
      </nav>
        <ul class="sidenav sidenav-close" id="mobile-demo">
            {renderList()}
        </ul>
    </div>
  );
};

export default Navbar;
