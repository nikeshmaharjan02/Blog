const sanitizeHtml = require('sanitize-html');
const { where } = require("sequelize")
const { blogs,users,comments } = require("../model")


const renderHome = async (req,res) =>{

    const [login] = req.flash('login')

    const blogsTableBlogs =  await blogs.findAll({
        include : {
            model : users
        }
   }) 
   
    res.render("home",{blogs : blogsTableBlogs,login})
}
const renderBlog = async (req,res) =>{

    const blogsTableBlogs =  await blogs.findAll({
        include : {
            model : users
        }
   }) 
   
    res.render("blog",{blogs : blogsTableBlogs})
}
const renderSingleBlog = async (req,res) =>{
    const userId = req.userId
    const blogId = req.params.id

    
    // const foundData = await blogs.findByPk(id)  returns object
    const foundData = await blogs.findAll({ // 
        where : {
            id : blogId
        },
        include : {
            model : users
        }
    })
    const commentsData = await comments.findAll({
        where : {
            blogId : blogId
        },
        include : {
            model : users
        }
    })
    if (foundData.length === 0) {
        req.flash('error', 'Blog not found');
        return res.redirect('/'); // Handle blog not found case
    }

    const blog = foundData[0];

    // Check if the logged-in user is the author of the blog post
    const isAuthor = blog.userId === userId;
    const [update] = req.flash('update')
    const [commenterror] = req.flash('commenterror')
    res.render("singleBlog",{blog : foundData, isAuthor : isAuthor,update,commenterror,comments : commentsData})
}

const addblog = async (req,res) =>{
    const {userId} = req
    const {title, subTitle, content} = req.body;
    // console.log(req.body)
    try{
        if(!title || !subTitle || !content){
            req.flash('error','Please Provide Title, Subtitle and Description');
            return res.redirect('/addblog')
        }
        // const formattedContent = content.replace(/\r?\n/g, '<br>');
        await blogs.create({
            title:title,
            subTitle:subTitle,
            content:content,
            image: process.env.backendUrl + req.file.filename,
            userId : userId
        });
        req.flash('success','Blog Posted Successfully')
        res.redirect("/profile")

    }catch (error){
        console.log(error);
        if (!res.headersSent){
            res.status(500).json({message: "Something went Wrong"});
        }
    }
}

const deleteBlog = async (req,res) =>{
    const id = req.params.id
    await blogs.destroy({
        where : {
            id : id
        }
    })
    
    res.redirect("/")
}
const updateBlog = async (req,res) =>{

    const {id} = req.params
    const {title,subTitle,content} = req.body 

    if(!title || !subTitle || !content){
        req.flash('error','Please Provide Title, Subtitle and Description');
        return res.redirect('/updateBlog')
    }

    await blogs.update({
        title : title,
        subTitle : subTitle,
        content : content
    },{
        where : {
            id : id
        }
    })
    req.flash('update','Blog Updated Successfully')
    res.redirect("/blog/" + id)
}

const addComment = async (req,res)=>{
    const {userId} = req 
    const {commentMessage,blogId} = req.body 
    if(!commentMessage || !blogId){
        req.flash('commenterror','Please Provide comment message!!');
        return res.redirect('/blog/' + blogId)
    }
    await comments.create({
        commentMessage,
        blogId,
        userId
    })
    
    res.redirect('/blog/' + blogId)
}
const deleteComment =async (req,res)=>{
    const {id} = req.params 

    const {userId} = req 
    const [comment] = await comments.findAll({
        where : {
            id 
        }
    })
    const blogId = comment.blogId
    if(comment.userId !== userId){
        return res.send("You don't have permission")
    }
    await comments.destroy({
        where : {
            id
        }
    })
    res.redirect(`/blog/${blogId}`)
}
module.exports ={addblog,renderHome,renderBlog,renderSingleBlog,deleteBlog,updateBlog,addComment,deleteComment}