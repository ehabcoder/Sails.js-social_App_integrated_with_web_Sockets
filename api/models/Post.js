/**
 * Post.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {


    attributes: {

      title: {
        type: 'string',
        required: true,
      },
      description: {
        type: 'string',
        required: true
      },
      
      imagePath: {
        type: 'string'
      },
  
      // One to Many relation User => Posts
      owner: {
        model: 'user'
      },
      
      // one to one realateion Post => Users Likes
      likes: {
        collection: 'user',
        via: 'like'
      }
    },


};

