/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


    getUsers: async function (req, res) {
        if (!req.isSocket) {
            return badRequest('Not a socket request!')
        }
        const users = await User.find();
        return res.status(200).json({ users: users, me: req.me })
    },

    getUser: async function (req, res) {
        if (!req.isSocket) {
            return badRequest();
        }
        const user = await User.find({ id: req.param('id') });
        if (user) {
            return res.status(200).json({ user: user });
        } else {
            return res.json({ message: "No user found!" });
        }
    },

    editProfile: async function (req, res) {
        req.file('image').upload({
            maxBytes: 10000000,
            dirname: require('path').resolve(sails.config.appPath, 'assets/images')
        }, async function whenDone(err, uploadedFiles) {
            if (err) {
                return res.serverError(err);
            }
            const user = await User.find({ id: req.me.id });
            if (!user) {
                return res.badRequest('something fishy here! Not authenticated.');
            }
            const updatedUser = await User.updateOne({ id: req.me.id })
                .set({
                    fullName: req.body.full_name,
                    emailAddress: req.body.email_address,
                    avatarURL: !uploadedFiles.length <= 0 ? uploadedFiles[0].fd.split('\\')[6] + '/' + uploadedFiles[0].fd.split('\\')[7] : user[0].avatarURL,
                });
            return res.redirect('/account');
        });
    },

    joinRoomAndGetAllMessages: async function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }
        let roomName = req.body.roomName;
        sails.sockets.join(req, 'messaging', async function (err) {
            if (err) {
                return res.serverError(err);
            }
            const sentmessages = await Message.find({
                sender: req.body.sender,
                receiver: req.body.receiver
            });
            const receivedmessages = await Message.find({
                sender: req.body.receiver,
                receiver: req.body.sender
            })
            return res.json({
                msg: 'Subscribed to a room called ' + roomName + '!',
                sentmessages: sentmessages,
                receivedmessages: receivedmessages
            })
        })
    },

    sendMessage: async function (req, res) {
        if (!req.isSocket) {
            return res.badRequest();
        }
        const sender = await User.find({ id: req.body.sender })
        sails.sockets.broadcast('messaging', 'message', { msg: req.body.message, sender: sender, receiverId: req.body.receiver }, req);
        const createdMessage = await Message.create({
            details: req.body.message,
            sender: req.body.sender,
            receiver: req.body.receiver
        }).fetch();
        return res.status(201).json({ msg: 'subscribed to room called ' + req.body.roomName + '! And successfully created the message on the server' });
    }
};

