/**
 * MessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
  

    sayHello: async function(req, res) {
        return res.json({message: "hello"})
    }
    // friendlyName: 'Say Hello!',

    // description: 'This action is made for saying Hello.',

    // inputs: {
    //     user: {
    //         description: 'The user whome we will say Hello!',
    //         type: 'string',
    //         required: true
    //     }
    // },

    // exits: {
    //     success: {
    //         responseType: 'text/html',
    //     },
    //     notFound: {
    //         description: "No user found",
    //         responseType: 'notFound'
    //     }
    // },

    // fn: async function({user}) {
    //     if(!user) {
    //         throw 'notFound';
    //     }
    //     return "hello " + user;
    // }

};

