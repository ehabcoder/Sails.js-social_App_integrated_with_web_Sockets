/**
 * PostController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    // create new post
    create: async function (req, res) {
        // first render the image then create the post.
        req.file('image').upload({
            maxBytes: 10000000,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images')
        },
            async function whenDone(err, uploadedFiles) {
                if (err) {
                    return res.serverError(err);
                }
                if (uploadedFiles.length === 0) {
                    return res.badRequest('No file was uploaded!');
                }
                let createdPost = await Post.create({
                    title: req.body.title,
                    description: req.body.description,
                    imagePath: uploadedFiles[0].fd.split('\\')[6] + '/' + uploadedFiles[0].fd.split('\\')[7],
                    owner: req.session.userId
                }).fetch();
            });
        return res.redirect('/welcome1');
    },

    // A route for just rendering the edit post page.
    showEditForm: async function (req, res) {
        const post = await Post.find({ id: req.param('id') });
        return res.view('pages/dashboard/editPost', { post: post[0], error: undefined })
    },

    // the actual edit post controller
    edit: async function (req, res) {
        req.file('image').upload({
            maxBytes: 10000000,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images')
        }, async function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
            const post = await Post.find({ id: req.param('id') });
            if (post[0].owner !== req.me.id) {
                return res.badRequest('something fishy here!');
            }
            const updatedPost = await Post.updateOne({ id: req.param('id') })
                .set({
                    title: req.body.title,
                    description: req.body.description,
                    imagePath: !uploadedFiles.length <= 0 ? uploadedFiles[0].fd.split('\\')[6] + '/' + uploadedFiles[0].fd.split('\\')[7] : post[0].imagePath,
                    owner: req.session.userId
                });

            if (updatedPost) {
                return res.redirect('/welcome3');
            } else {
                return res.view('pages/dashboard/editPost', { post: post[0], error: "Error! Please try again later!" });
            }
        });
    },

    // Delete a specific post
    delete: async function (req, res) {
        const burnedPost = await Post.destroyOne({ id: req.param('id') });
        if (burnedPost) {
            return res.redirect('/welcome2');
        } else {
            const posts = await Post.find();
            return res.view('pages/dashboard/welcome', { posts: posts, userId: req.me.id, error: "Error! We can't delete that post! try again later.", success: undefined })
        }
    },

    // Rendering the welcome page after deleting the post
    redirectAfterDelete: async function (req, res) {
        const posts = await Post.find();
        return res.view('pages/dashboard/welcome', { posts: posts, userId: req.me.id, error: undefined, success: "Deleted Successfully!" })
    },

    // Rendering the welcome page again after createing new post.
    redirectAfterCreate: async function (req, res) {
        const posts = await Post.find();
        return res.view('pages/dashboard/welcome', { posts: posts, userId: req.me.id, error: undefined, success: "Tweet Created Successfully!" })
    },

    // Rendering the welcome page after editing a specific post
    redirectAfterEdit: async function (req, res) {
        const posts = await Post.find();
        return res.view('pages/dashboard/welcome', { posts: posts, userId: req.me.id, error: undefined, success: "Tweet Edited Successfully!" })
    }

};

