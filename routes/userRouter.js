const { signup, signin, profile} = require('../controller/userController');
const { isAuthenticated } = require("../middleware/isAuthenticated")


const express = require("express");
const router = express.Router();

const { multer, storage } = require('../middleware/multerConfig'); // Correct path to the middleware directory
const upload = multer({ storage: storage });

const { users,blogs } = require("../model")



/* Signup Page. */
router.get('/register', function(req, res) {
    const [error] = req.flash('error')
    res.render('signup',{error});
});
router.post('/register', upload.single('profilePicture'), signup)


/* GET Login page. */
router.get('/login', function(req, res) {
    const [error] = req.flash('error')
    const [register] =req.flash('register')
    res.render('login',{error,register});
}); 
router.post('/login', signin)

/* GET Logout page. */
router.get('/logout',(req,res)=>{
    res.clearCookie('token')
    res.redirect("/login")
})

// /* GET Profile page. */
// router.get('/profile/',(req,res)=>{
//   res.send("profile page")
// })
router.get('/profile',isAuthenticated, async (req, res) => {
    try {
        const userId = req.userId; // This is set by the isAuthenticated middleware

        const user = await users.findByPk(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
         // Find blogs only for the specific user
         const blogsTableBlogs = await blogs.findAll({
            where: {
                userId: userId
            },
            include: {
                model: users
            }
        });

        const [success] = req.flash('success')
        res.render('profile', { user: user, blogs : blogsTableBlogs, success });
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});



module.exports=router;