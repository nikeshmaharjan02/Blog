const { addblog,renderHome,renderBlog,renderSingleBlog,deleteBlog,updateBlog} = require('../controller/blogController');
const { blogs,users } = require("../model")
const express = require("express");
const router = express.Router();

const { multer, storage } = require('../middleware/multerConfig'); // Correct path to the middleware directory
const upload = multer({ storage: storage });

const { isAuthenticated } = require("../middleware/isAuthenticated")

router.get("/",  renderHome);
router.get("/about",  (req,res)=>{
    res.render("about");
});
router.get("/addblog", isAuthenticated, (req,res)=>{
    const [error] = req.flash('error')
    const [success] =req.flash('error')
    res.render('addblog',{error,success});
});
router.post('/addblog',isAuthenticated, upload.single('image'), addblog)
router.get("/blog",isAuthenticated, renderBlog);
router.get("/blog/:id",isAuthenticated, renderSingleBlog);
router.get("/delete/:id",isAuthenticated, deleteBlog);
router.get("/update/:id",isAuthenticated, async (req,res) => {
    const id = req.params.id
    const blog = await blogs.findByPk(id)
    console.log("blog:",blog)
    const [error] = req.flash('error')
    const [success] =req.flash('error')
    res.render("updateBlog",{id ,blog,error,success})
});
router.post("/update/:id",isAuthenticated,upload.single('image'), updateBlog);



module.exports=router;