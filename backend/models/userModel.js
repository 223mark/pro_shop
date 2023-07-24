import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
     email: {
        type: String,
         required: true,
        unique: true
    },
      password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, { timestamps: true })

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}
// "pre" is a function that allow us to do before data save to the  database -> save is action we can do
userSchema.pre('save', async function (next) {

    // isModified ?
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
})

// "post" is after we save to the database
const User = mongoose.model("User", userSchema);

export default User;