const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const getUser = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: getEvents.bind(this, user.createdEvents)
        }
    }
    catch(err) {
        throw err;
    }
}

const getEvents = async eventIds => {
    try {
        const events = await Event.find({_id: {$in: eventIds}});
        return events.map(event => ({
            ...event._doc,
            _id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: getUser.bind(this, event.creator)
        }));
    }
    catch(err) {
        throw err;
    }
}

module.exports = {
    events : async () => {
        try {
            const events = await Event.find();
            return events.map(event => (
                {
                    ...event._doc,
                    _id: event.id,
                    creator: getUser.bind(this, event._doc.creator)
                }
            ));
        }
        catch (err) {
            throw err;
        }
    },
    createEvent: async ({ eventInput: {title, description, price, date}}) => {
        try {
            const event = new Event({
                title,
                description,
                price: +price,
                date: new Date(date),
                creator: '5cfc9094aacdbfa247abfd54'
            });
            let result = await event.save();
            const createdEvent = {
                ...result._doc,
                _id: result.id,
                date: new Date(result._doc.date).toISOString(),
                creator: getUser.bind(this, result.creator)
            }
            const user = await getUser('5cfc9094aacdbfa247abfd54');
            user.createdEvents.push(createdEvent);
            return await user.save();
        }
        catch(err) {
            throw err;
        }

    },
    createUser: async ({ userInput: { email, password } }) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log(email, password);
                const hashedPassword = await bcrypt.hash(password, 12);
                const newUser = new User({
                    email,
                    password: hashedPassword
                });
                const result = await newUser.save();
                return { ...result._doc, password: null, _id: result.id};
            } else {
                console.log(user);
                throw new Error('User already exists');
            }
        }
        catch (err) {
            throw err;
        }
    }
}