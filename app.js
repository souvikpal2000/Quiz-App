const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const { Score, Game } = require("./models/scores");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/", (req, res, next) => {
  res.render("home");
});

app.get("/quiz", (req, res, next) => {
  res.render("quiz");
});

app.post("/user", (req, res, next) => {
  const category = req.body.category === "Any Category" ? 0 : req.body.category;
  Score.findOne({ email: req.body.email, category: category })
    .then((user) => {
      if (!user) {
        const newUser = new Score({
          email: req.body.email,
          name: req.body.name,
          category: category,
          token: req.body.token,
        });
        return newUser.save();
      }
      // Score.updateOne({ email: user.email, category: user.category }, { token: req.body.token }, (err) => {
      //   if (err) {
      //     return res.json({ message: "existing one found !", user: user });

      //   }
      //   return res.json({ message: "existing one found !",tokenStat:'changed', user: user });

      // });

      return res.json({ message: "existing one found !", user: user });
    })
    .then((user) => {
      return res
        .status(201)
        .json({ message: "success !", statusCode: "200", user: user });
    })
    .catch((err) => {
      // console.log(err);
      //res.status(500).json({ error: err });
    });

  // newUser
  //   .save()
  //   .then((user) => {
  //     return res
  //       .status(201)
  //       .json({ message: "success !", statusCode: "200", user: user });
  //   })
  //   .catch((err) => {

  //   });
});

app.put("/user/score", (req, res, next) => {
  console.log("------------------------------------------------------");
  console.log(req.body.email + " " + req.body.category + " " + req.body.score);
  Score.findOneAndUpdate(
    { email: req.body.email, category: req.body.category },
    { score: req.body.score, justJoined: false }
  )
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "not found !" });
      }
      if (user.token === req.body.token) {
        return res.status(409).json({ message: "already exists" });
      }

      if (user.justJoined) {
        return res.status(200).json({ message: "score added !" });
      }
      const newGame = new Game({
        score: user.score,
        updatedAt: user.updatedAt,
        token: user.token,
      });
      console.log(newGame);
      Score.updateOne(
        { email: user.email, category: user.category },
        { $push: { pastGame: newGame }, token: req.body.token },
        (err) => {
          if (!err) {
            return res.status(200).json({ message: "score added !" });
          }
          console.log(err);
        }
      );
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: err });
    });
});

app.get("/scores/:category", (req, res, next) => {
  Score.find({ category: req.params.category })
    .then((scores) => {
      if (!scores) {
        return res.status(404).json({ message: "no participant yet" });
      }
      return res.status(200).json({ scoreboard: scores });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

app.get("/user", (req, res, next) => {
  const email = req.query.userMail;
  if (!email) {
    return res.status(422).json({ message: "Validation Failed" });
  }
  Score.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "yet not exist" });
      }
      // console.log(user.name);
      return res.status(200).json({ name: user.name });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

app.get("/user/score", (req, res, next) => {
  const email = req.query.email;
  const category = req.query.category;
  let pastScore = req.query.pastScore;
  if (!email || !category) {
    return res.status(400).json({ message: "invalid query" });
  }
  if (typeof pastScore === "undefined") {
    pastScore = false;
  }
  Score.findOne({ email: email, category: category })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }
      if (pastScore) {
        return res.status(200).json({
          id: user._id,
          email: user.email,
          category: user.category,
          pastScores: user.pastGame,
        });
      }
      return res.status(200).json({
        id: user._id,
        email: user.email,
        category: user.category,
        score: user.score,
        updatedAt: user.updatedAt,
        pastScores: user.pastGame,
      });
    })
    .catch((err) => console.log(err));
});

// only for testing ---- remove before production
app.get("/delete", (req, res, next) => {
  Score.deleteMany()
    .then(() => {
      res.json({ message: "Deleted All Data" });
    })
    .catch((err) => {
      res.json({ error: err });
    });
});
//----------------------remove before production-----------------------------------

mongoose
  .connect("mongodb://localhost:27017/quizDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(
    app.listen(3000, () => {
      console.log("listening at port 3000");
    })
  )
  .catch((err) => console.log(err));
