const { addComment, deleteComment } = require("../controller/blogController")
const { isAuthenticated } = require("../middleware/isAuthenticated")
const express = require("express");
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("Comment HomePage");
});
router.route("/comment").post(isAuthenticated,addComment)
router.route("/deletecomment/:id").get(isAuthenticated,deleteComment)

module.exports=router;