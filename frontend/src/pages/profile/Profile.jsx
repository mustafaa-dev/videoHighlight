import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { MdOutlineVideoLibrary, MdOutlineFavorite } from "react-icons/md";

import vod2 from "../../assests/2015-02-21 - 18-00 Crystal Palace 1 - 2 Arsenalc1.mkv";
import vod3 from "../../assests/2015-05-17 - 18-00 Manchester United 1 - 1 Arsenalg6.mkv";
import vod4 from "../../assests/2015-02-21 - 18-00 Swansea 2 - 1 Manchester Unitedg2.mkv";

import { MdDelete } from "react-icons/md";

import LoaderBall from "../../components/loader/LoaderBall";

import axios from "axios";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import "./profile.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("vh_user"));
  const logUser = user.userData;
  //console.log(logUser);

  //console.log(` sgajdgh ${logUser.pic.image.data.$binary.base64}`);
  const enc = logUser.pic.image.data;

  const [activeClass, setActiveClass] = useState("left");
  const [userHighlightedVideos, setUserHighlightedVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const getVideos = async () => {
      try {
        await axios
          .get("http://localhost:8080/profile/getVideos", {
            headers: {
              Authorization: JSON.parse(localStorage.getItem("vh_user")).token,
            },
          })
          .then((response) => {
            console.log(response.data);
            setUserHighlightedVideos(response.data);
            setIsLoading(false);
          });
      } catch (error) {
        console.log(error);
      }
    };

    getVideos();
  }, []);

  const handleDeleteVideo = async (videoid) => {
    try {
      await axios.delete("http://localhost:8080/profile/deleteHighlight", {
        data: { videoId: videoid },
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("vh_user")).token,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const favoriteVideos = [
    {
      id: 3,
      title: "Video 3",
      url: vod3,
    },
    {
      id: 4,
      title: "Video 4",
      url: vod4,
    },
  ];

  return (
    <div className="profile-page">
      <div className="main-cont">
        <div className="profile-data d-flex">
          <img
            className="profile-img"
            src={`data:${logUser.pic.image.contentType};base64,${enc}`}
          />

          <div className="name-data mt-4">
            <p className="profileName">{`${logUser.firstName} ${logUser.lastName}`}</p>

            <div className="stat-data">
              <div className="highlighted d-flex gap-2 fw-bold">
                <p>{logUser.doneVideos.length}</p>
                <p>Highlighted</p>
              </div>

              <div className="fav d-flex gap-2 fw-bold">
                <p>{logUser.favVideos.length}</p>
                <p>Favourites</p>
              </div>
            </div>

            <button className="py-2 px-4 rounded">
              <Link to="/edit">Edit Profile</Link>
            </button>
          </div>
        </div>
        <hr
          className="hrr"
          style={{
            color: "#fff",
            height: "1",
            margin: "auto",
            width: "80%",
          }}
        />
        <div className="mobile-data">
          <div className="highlighted d-flex flex-column align-items-center fw-bold">
            <p>4</p>
            <p>Highlighted</p>
          </div>

          <div className="fav d-flex flex-column align-items-center fw-bold">
            <p>2</p>
            <p>Favourites</p>
          </div>
        </div>
      </div>

      <hr
        style={{
          color: "#fff",
          height: "1",
          margin: "auto",
          width: "80%",
        }}
      />

      <div className="vedio-states mt-2 d-flex gap-5">
        <div
          className={
            activeClass === "left" ? "active d-flex gap-2" : "d-flex gap-2"
          }
          onClick={() => setActiveClass("left")}
        >
          <MdOutlineVideoLibrary size={27} />
          <p>Highlighted</p>
        </div>

        <div
          className={
            activeClass === "right" ? "active d-flex gap-2" : "d-flex gap-2"
          }
          onClick={() => setActiveClass("right")}
        >
          <MdOutlineFavorite size={27} />
          <p>Favourites</p>
        </div>
      </div>

      <div className="vedio-div">
        {activeClass === "left" ? (
          <div className="vedio-cont">
            {isLoading ? (
              <LoaderBall message={"loading highlighted videos"} />
            ) : (
              userHighlightedVideos.map((vod) => (
                <div className="vedio-card" key={vod._id}>
                  <video src={vod.highlightUrl} controls>
                    {" "}
                  </video>
                  <div
                    className="d-flex w-100 mt-2"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <OverlayTrigger
                      overlay={
                        <Tooltip placement="bottom" id={vod._id}>
                          {vod.title}
                        </Tooltip>
                      }
                    >
                      <p className="paragraph-text">{vod.title}</p>
                    </OverlayTrigger>
                    <MdDelete
                      className="del"
                      onClick={() => handleDeleteVideo(vod._id)}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="vedio-cont">
            {favoriteVideos.map((vod) => (
              <div className="vedio-card">
                <video src={vod.url} controls>
                  {" "}
                </video>
                <div
                  className="d-flex w-100 mt-2"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ margin: "0" }}>{vod.title}</p>
                  <MdDelete className="del" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
