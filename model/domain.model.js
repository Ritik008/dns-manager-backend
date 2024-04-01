
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const domainSchema = new Schema({
  domainId: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Domain', domainSchema);
