const { spawn } = require("child_process");
const path = require("path");

exports.merge = (tempPath, videoName, ext) => {
  return new Promise((resolve, reject) => {
    jpgPyPath = path.join(
      __dirname,
      "../",
      "assets",
      "generate",
      "model",
      "utils",
      "merge.py"
    );
    const splitVideo = spawn("python", [jpgPyPath, tempPath, videoName, ext]);
    splitVideo.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
    });

    splitVideo.stderr.on("data", (data) => {
      // console.error(`stderr: ${data}`);
      // reject("error on Merging");
    });

    splitVideo.on("close", (code) => {
      // console.log(`child process exited with code ${code}`);
      resolve(tempPath);
    });
  });
};
