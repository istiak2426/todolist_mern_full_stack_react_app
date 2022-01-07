const router = require("express").Router();

const Post = require("../Models/Post")
const User = require("../Models/User.model");




// create a note

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });




  //delete a note

router.delete("/delete/:id", async (req, res) => {
  const result = await Post.findByIdAndDelete(req.params.id)
  res.json(result);
      
  });


  // get users all note

  router.get("/lists/:userId", async (req, res) => {
    
    try {  
      const currentUser = await User.findById(req.params.userId)
      const userPost = await Post.find({ userId: currentUser._id})
      res.status(200).json(userPost);

     
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/complete/:id",  async(req, res)=> {
    const edit =   await Post.findById(req.params.id)

    edit.complete = !edit.complete;
    edit.save();
    
    res.json(edit);

  })

module.exports = router;