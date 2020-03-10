const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

// const task = new Task({
//     description: '   test.   ',
// });

// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log('Error!', error);
// });
