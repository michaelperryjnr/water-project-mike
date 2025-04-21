const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    staffNumber: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    hashedPassword: {type: String, required: true},
    position: {type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true},
    refreshToken: {type: String, default: null},
}, {
    timestamps: true
})

userSchema.pre('save', function(next) {
    if(this.username) {
        this.username = this.username.toLowerCase();
    }

    if (this.email) {
        this.email = this.email.toLowerCase();
    }
    next();
})


userSchema.pre("findOneAndUpdate", function(next) {
    if(this._update.username) {
        this._update.username = this._update.username.toLowerCase();
    }

    if (this._update.email) {
        this._update.email = this._update.email.toLowerCase();
    }
    next();
})


const User = mongoose.model("User", userSchema);

module.exports = User;