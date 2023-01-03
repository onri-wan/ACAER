const cloudinary = require('../middleware/cloudinary')
const Post = require('../models/Post')

module.exports = {
    getProfile: async (req, res) => {
        try {
            const posts = await Post.find({ user: req.user.id })
            res.render('profile.pug', { posts: posts, user: req.user })
        } catch (error) { console.error(error) }
    },
    getFeed: async (req, res) => {
        try {
            const posts = await Post.find().sort({ createdAt: 'desc' }).lean()
            res.render('feed.pug', { posts: posts })
        } catch (error) { console.error(error) }
    },
    getPost: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id)
            res.render('post.pug', { post: post, user: req.user })
        } catch (error) { console.error(error) }
    },
    createPost: async (req, res) => {
        try {
            // upload image to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path)

            await Post.create({
                title: req.body.title,
                image: result.secure_url,
                cloudinaryId: result.public_id,
                caption: req.body.caption,
                likes: 0,
                user: req.user.id
            })

            res.redirect('/profile')
        } catch (error) { console.error(error) }
    },
    likePost: async (req, res) => {
        try {
            await Post.findOneAndUpdate({ _id: req.params.id }, { $inc: {likes: 1} })
            res.redirect(`/post/${req.params.id}`)
        } catch (error) { console.error(error) }
    },
    deletePost: async (req, res) => {
        try {
            console.log('trash is pressed')
            // find post by id - also checks if post exists
            const post = await Post.findById({ _id: req.params.id })
            // delete image from Cloudinary
            await cloudinary.uploader.destroy(post.cloudinaryId)
            // delete post from db
            await Post.remove({ _id: req.params.id })
            res.redirect('/profile')
        } catch (error) {
            console.error(error)
            res.redirect('/profile')
        }
    }
}