const mongoose = require("mongoose");
const blogs = [
  {
    _id: mongoose.Types.ObjectId(),
    body: "Am Erota Oluwafemi, a software engineering student at altschool",
    title: "james",
    description: "description",
    tags: "#backend",
    state: "published",
  },
];

module.exports = blogs;