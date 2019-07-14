const fs = require("fs");
const path = require("path");
const appDirectory = fs.realpathSync(process.cwd());

module.exports.resolve = (...relativePaths) => path.resolve(appDirectory, ...relativePaths);