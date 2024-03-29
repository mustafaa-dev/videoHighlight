const { spawn } = require("child_process");
const path = require("path");

exports.runModel = (tempPath) => {
  return new Promise((resolve, reject) => {
    let tD = tempPath;
    let mainPyPath = path.join(
      __dirname,
      "../",
      "assets",
      "generate",
      "model",
      "main.py"
    );
    const splitVideo = spawn(process.env.PYTHON_VERSION, [
      mainPyPath,
      "--root_path",
      tD + "/",
    ]);
    splitVideo.stdout.on("data", (data) => {
      // console.log(`stdout: ${data}`);
      // console.log("1-Splitting Video");
    });

    splitVideo.stderr.on("data", (data) => {
      // console.error(`stderr: ${data}`);
      // reject("error on model: " + data);
    });

    splitVideo.on("close", (code) => {
      // console.log(`child process exited with code ${code}`);
      resolve();
    });
  });
};
