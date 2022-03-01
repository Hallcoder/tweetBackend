const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Joi = require("joi");
const { date, link } = require("joi");
const props = require("./properties");
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const cors = require("cors");
const { tweetSchema } = require("./tweetSchema");

app.listen(PORT, () => {
  console.log(`Server is running Carry on , on ${PORT}`);
});

mongoose.connect("mongodb+srv://Brainiacs_user:jPxVoB5sOM4UdVq1@cluster0.wmwkp.mongodb.net/twitter?authSource=admin&replicaSet=atlas-2kdib7-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true")
.then(_ => console.log("Connected to the db...."))

app.use(bodyParser.json());
app.use(cors());
// let schema = Joi.object({
//   createTime: Joi.date().min().required(),
//   id: Joi.number().required(),
//   text: Joi.string().min(5).required(),
// });

let tweets = [];

app.get("/tweets", (req, res) => {
  for (i = 0; i < props.length; i++) {
    tweets.push({
      CreateTime: props[i].created_at,
      id: props[i].id,
      text: props[i].text,
    });
  }
  res.send(tweets);
});

app.get("/users", (req, res) => {
  let users = [];
  for (i = 0; i < props.length; i++) {
    users.push(props[i].user);
  }
  res.send(users);
});



app.get("/tweet/:id", (req, res) => {
  var result;
  let  error  = props.find((c) => c.id == req.params.id);
  if (error)
    return res
      .status(404)
      .send(
        `Tweet with the id:${req.params.id} is not missing, Help us find him hhhhhh`
      );
  for (i = 0; i < props.length; i++) {
    if (props[i].id == req.params.id) {
      result = props[i];
    }
  }
  return res.send(result);
});

app.get("/user/:screen_name", (req, res) => {
  var user;
  for (i = 0; i < props.length; i++) {
    if (props[i].user.screen_name == req.params.screen_name) {
      user = props[i].user;
    }
  }
  res.send(user);
});

app.post("/tweet/post", async(req,res)=>{
  
  try{
    const tweet = await new tweetSchema({
      createTime:Date.now(),
      text:req.body.text
    })
    const newTweet = JSON.stringify(tweet)
    await tweet.save();
    res.end(newTweet);
      }
  catch(err){
   return res.json({ error: err.message});
  }
  
})

app.get("/links", (req, res) => {
  let links = [];
  try {
    for (i = 0; i < props.length; i++) {
      for (prop in props[i]) {
        if (JSON.stringify(props[i][prop]).search(/https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}/) > 0){
          links.push(props[i][prop]);
        }   
      }
    }
  } 
  catch (err) {
    console.log("Error:" + err.message);
  }
  res.send(links)

});
