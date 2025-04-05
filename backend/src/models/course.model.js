import mongoose from "mongoose"

const courseSchema= new  mongoose.Schema({

coursename:{
    type:String,
    require:true
},

description: {
    type: String,
    required: true
},

isapproved: {
    type: Boolean,
    default: false
},

liveClasses: [{
    title: String,
    timing: Number,
    date:Date,
    link: String,
    status: {
        type: String,
        enum: ['upcoming', 'in-progress', 'completed'],
        default: 'upcoming'
      }
  }],

enrolledteacher:{
    type:mongoose.Schema.Types.ObjectId,
    ref: "teacher",
    require:true
},

enrolledStudent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'student' 
  }],

schedule: [{
    day: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5, 6]
    },
    starttime: {
        type: Number,
        min: 0,
        max: 24 * 60 
    },
    endtime: {
        type: Number,
        min: 0,
        max: 24 * 60 
    }
}],

learningMaterials: [{
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['pdf', 'image', 'audio', 'ppt', 'link', 'other'],
        required: true
    },
    url: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}]

},{timestamps:true})

const course= mongoose.model('course',courseSchema)

export {course}