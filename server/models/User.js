const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  dp: {
    type: String,
    default:
      "https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255710-stock-illustration-avatar-vector-male-profile-gray.jpg",
  },
  email: String,
  name: String,
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: Number },
  center: { type: String },
  slot: { type: Date }, // length 1hr
  queue_no: { type: Number, default: -1 },
  entry_time: { type: Date },
  esitimated_time: { type: Date },
  notify_id: String,
});

//TODO Add fields by admins

const User = mongoose.model("user", userSchema);

module.exports = { User };
