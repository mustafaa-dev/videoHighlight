const { splitVideo } = require("./splitVideo");
const { clipToJpg } = require("./clipToJpg");
const { getVideoName } = require("./getVideoName");
const { jpgToJson } = require("./jpgToJson");
const { runModel } = require("./runModel");
const { merge } = require("./merge");
const path = require("path");

const fs = require("fs");

const { promisify } = require("util");
const { ExtractJson } = require("./jsonExtract");
const copyFile = promisify(fs.copyFile);

// const mkdir = promisify(fs.mkdir);

exports.callingFunctions = async (videoName, ext, tempDir, highlightPath) => {
  return new Promise((res, rej) => {
    console.log("working on:" + videoName);
    splitVideo(videoName, ext, tempDir)
      .then((video) => {
        console.log("1- Creating Clips Done");
        clipToJpg(videoName, video.tempDir, video.ext)
          .then((video) => {
            console.log("2- Clips to JPG Done");
            getVideoName(videoName, video.tempPath)
              .then((video) => {
                console.log("3- Making Video Names Done");
                jpgToJson(videoName, video.tempPath)
                  .then((video) => {
                    console.log("4- Json Created Successfully");
                    runModel(video.tempPath)
                      .then((video) => {
                        console.log("5- Model Done ");
                        ExtractJson(videoName, tempDir)
                          .then((video) => {
                            console.log("6- Extract Json Done");

                            merge(tempDir, ext)
                              .then(() => {
                                console.log("7- Merge Done , Path: " + tempDir);

                                // mkdir(path.join(tempDir, "result")),
                                copyFile(
                                  path.join(tempDir, "highlighted." + ext),
                                  path.join(highlightPath, "highlighted." + ext)
                                );
                                res();
                              })
                              .catch((err) => {
                                console.error(err);
                              });
                          })
                          .catch((err) => {
                            console.error("Error on Json Extract");
                          });
                      })

                      .catch((err) => {
                        console.error(err);
                      });
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              })
              .catch((err) => {
                console.error(err);
              });
          })
          .catch((err) => {
            console.error(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
