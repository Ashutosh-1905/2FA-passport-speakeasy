import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "user name is required."],
        unique:[true, "username must be unique."]
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },

    isMfaActive: {
        type: Boolean,
        default: false,
    },

    twoFactorSecret: {
        type:String,
    }
}, {timestamps: true});

const User = model("User", userSchema);

export default User;