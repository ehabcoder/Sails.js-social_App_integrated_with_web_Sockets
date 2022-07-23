module.exports = {


  friendlyName: 'View welcome page',


  description: 'Display the dashboard "Welcome" page.',


  exits: {

    success: {
      description: 'Display the welcome page for authenticated users.'
    },

  },


  fn: async function () {
    const posts = await Post.find();
    return this.res.view('pages/dashboard/welcome', {posts: posts, userId: this.req.me.id, error: undefined, success: undefined});
  }


};
