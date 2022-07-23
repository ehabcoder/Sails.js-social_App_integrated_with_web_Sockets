/**
 * Message.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    details: {
      type: 'string',
      required: true
    },
    sender: {
      model: 'user'
    },
    receiver: {
      model: 'user'
    }
  },

};

