import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type:Number,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        enum:['student','recruiter'],
        required:true

    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{
            type:String,
            default:""
        }

    }
})

// const User = mongoose.model("User", UserSchema);
// export default User;
export const User = mongoose.model('User', UserSchema);
