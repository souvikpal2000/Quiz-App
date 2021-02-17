const mongoose = require("mongoose");
// const quizSchema = new mongoose.Schema({
//   category: {
//     type: Number,
//     required:true,
//   },
//   score:Number
// });

const gameSchema = new mongoose.Schema({
  token:String,
  score: Number,
  updatedAt: Date,
});

const scoreSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Number,
      required: true,
    },
    token:String,
    score: Number,
    pastGame: [gameSchema],
    justJoined: {
      type: Boolean,
      default:true,
    },
  },
  
  { timestamps: true }
);

module.exports.Score = mongoose.model("Score", scoreSchema);
module.exports.Game = mongoose.model("Game", gameSchema);
