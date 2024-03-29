import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { DefaultPlayer as Video } from "react-html5video";
import "react-html5video/dist/styles.css";

import LoaderBall from "../../components/loader/LoaderBall";
import { BiTrendingUp } from "react-icons/bi";
import { AiFillHeart, AiOutlineCloudDownload } from "react-icons/ai";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { Link } from "react-router-dom";

import "./popular.css";

const Popular = () => {
  const user = JSON.parse(localStorage.getItem("vh_user"));
  const [popularVideos, setPopularVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getPopularData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        await axios
          .get(`http://localhost:8080/videos/all`)
          .then(async (popvideos) => {
            if (user) {
              //console.log("asnd" + JSON.stringify(popvideos.data.owner));
              await axios
                .get(`http://localhost:8080/profile/getFavVideos`, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: JSON.parse(localStorage.getItem("vh_user"))
                      .token,
                  },
                })
                .then((favVideos) => {
                  console.log(favVideos.data);
                  const favVideosIds = favVideos.data.map((voood) => voood._id);
                  //console.log("sanjkas" + favVideosIds);

                  const updatedVideos = popvideos.data.map((voood) => ({
                    ...voood,
                    isFavorite: favVideosIds.includes(voood._id),
                  }));
                  setPopularVideos(
                    updatedVideos
                      .filter((vid) => vid.highlightUrl !== "#")
                      .reverse()
                  );
                  console.log(popularVideos);
                  setIsLoading(false);
                });
            } else {
              console.log("asnckldnl");
              setPopularVideos(
                popvideos.data
                  .filter((vid) => vid.highlightUrl !== "#")
                  .reverse()
              );
              setIsLoading(false);
            }
          });
      } catch (err) {
        console.log(err);

        setIsLoading(false);
        setIsError(true);
      }
    };

    getPopularData();
  }, []);

  const handleAddToFavourites = async (id) => {
    const targetObject = popularVideos.find((obj) => obj._id === id);
    const checkVideo = targetObject.isFavorite;
    console.log(checkVideo);
    if (!checkVideo) {
      try {
        let data = { videoId: id };
        let headers = {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("vh_user")).token,
        };

        await axios.put(`http://localhost:8080/profile/addToFav`, data, {
          headers,
        });

        //console.log("snnaksnkksk");
        const updatedVideos = popularVideos.map((voood) =>
          voood._id === id ? { ...voood, isFavorite: true } : voood
        );
        //console.log(updatedVideos);
        setPopularVideos(updatedVideos);
        console.log(popularVideos);
        toast.success("The video is added sucessecfully", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.log("Error making PUT request:", error);
      }
    } else {
      try {
        await axios.delete(`http://localhost:8080/profile/removeFromFav`, {
          data: { videoId: id },
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("vh_user")).token,
          },
        });
        const updatedVideos = popularVideos.map((voood) =>
          voood._id === id ? { ...voood, isFavorite: false } : voood
        );
        //console.log(updatedVideos);
        setPopularVideos(updatedVideos);
        console.log(popularVideos);
        toast.success("The video is deleted sucessecfully", {
          position: "bottom-left",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="poular-page" style={{ color: "white" }}>
      <div className="main-header-cont">
        <h1 className="main-header">Recent Videos</h1>
        {/* <BiTrendingUp style={{ width: "2rem", height: "2rem" }} /> */}
      </div>

      {isLoading ? (
        <LoaderBall message={"Loading Recent videos"} />
      ) : isError ? (
        <h1 style={{ color: "white", textAlign: "center" }}>
          There is problem in the server Please try again later
        </h1>
      ) : (
        <div className="sports-cont">
          <div className="sport-cont">
            <div className="vedio-cont">
              {popularVideos.slice(0, 20).map((video) => (
                <div
                  className="veedio-card"
                  key={video._id}
                  style={{ width: "28.125rem" }}
                >
                  <div
                    className="d-flex titlee"
                    style={{
                      borderBottom: "0.5px solid white",
                      marginBottom: "1rem",
                    }}
                  >
                    <div className="owner d-flex justify-content-space-between ">
                      <Link
                        to={`/profile/${video.owner._id}`}
                        style={{ color: "unset", textDecoration: "none" }}
                        className="d-flex align-items-center gap-1"
                      >
                        <img
                          src={`data:${video.owner?.pic?.image?.contentType};base64,${video.owner?.pic?.image?.data}`}
                          alt=""
                          style={{
                            width: "2rem",
                            height: "2rem",
                            borderRadius: "50%",
                            cursor: "pointer",
                          }}
                        />
                        {video.owner.firstName}
                      </Link>
                    </div>
                    <p>{video.createdAt.slice(0, 10)}</p>
                  </div>

                  <Video
                    controls={[
                      "PlayPause",
                      "Seek",
                      "Time",
                      "Volume",
                      "Fullscreen",
                    ]}
                    style={{ width: "100%", maxHeight: "224px" }}
                  >
                    <source src={video.highlightUrl} />
                  </Video>
                  <div className="d-flex titlee">
                    <OverlayTrigger
                      overlay={
                        <Tooltip placement="bottom" id={video._id}>
                          {video.title}
                        </Tooltip>
                      }
                    >
                      <p className="paragraph-text">{video.title}</p>
                    </OverlayTrigger>

                    {user && (
                      <div className="d-flex gap-2">
                        <AiFillHeart
                          onClick={() => handleAddToFavourites(video?._id)}
                          style={{
                            color: !video.isFavorite ? "white" : "red",
                            cursor: "pointer",
                          }}
                          size={25}
                        />
                        <a
                          download=""
                          href={video.highlightUrl}
                          style={{ color: "unset" }}
                        >
                          <AiOutlineCloudDownload
                            size={25}
                            style={{ cursor: "pointer" }}
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Popular;
