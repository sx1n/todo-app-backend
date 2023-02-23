import mongoose, { Schema } from 'mongoose';

const taskSchema = new Schema({
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    require: true,
    default: false
  }
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
