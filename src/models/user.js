const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const Task = require('./task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        default: 0,

        //custom validator for a field
        validate(value) { //value -> the input of age
            if (value < 0) {
                throw new Error('Age must be a postive number!');
            }
        }
    },
    email: {
        type: String,
        unique: true, //guarantee login uniqueness
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            //use validator module
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Do not use "password" in password.');
            }
        }
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

// virtual property
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
});

//instance method
userSchema.methods.toJSON = function() {
    const user = this;
    const userObj = user.toObject();

    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar; // To improve performance as the size of image file is big

    return userObj;
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

//define login validation function
//model method (acceptable on the model)
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to login.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login.');
    }
    return user;
};

//User middleware of mongoose
//define a function to be excuted before the 'save' event
//Hash the plain text password before saving
userSchema.pre('save', async function(next) {
    //this -> the document to be saved
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next(); //end of the function
});

// Delete user's tasks when the user is deleted
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
});

// create and User model
// {'name for your model', {definition}}
// Mongoose provides a basic type validation
const User = mongoose.model('User', userSchema);

module.exports = User;

// //model instance
// const me = new User({
//     name: '   Mike     ',
//     email: 'mike@me.io  ',
//     password: 'Password'
// });

// //save the instance to the db (return a promise)
// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log('Error!', error);
// });
