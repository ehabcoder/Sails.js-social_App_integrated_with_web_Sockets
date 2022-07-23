/**
 * MessageController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

    getMessagesForOneUser: async function(req, res) {
        if(!req.socket) return res.badRequest();
        const messages = await Message.find({sender: req.me.id, receiver: req.param('id')});
        return res.status(200).json({messages: messages});
    }

};

