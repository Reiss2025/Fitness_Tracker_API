//Store tokens to prevent reuse
const tokenBlacklist = new Set();

//Export the blacklist for use in other files
module.exports = tokenBlacklist;