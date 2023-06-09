// models/File.js

var mongoose = require('mongoose');

// schema
var fileSchema = mongoose.Schema({
    originalFileName:{type:String},
    serverFileName:{type:String},
    size:{type:Number},
    uploadedBy:{type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
    postId:{type:mongoose.Schema.Types.ObjectId, ref:'post'},
    fileURL:{type:String, required:true},
    isDeleted:{type:Boolean, default:false},
});

// model & export
var File = mongoose.model('file', fileSchema);

// model methods
File.createNewInstance = async function(file, uploadedBy, postId, fileURL){
    return await File.create({
        originalFileName:file.originalname,
        serverFileName:file.filename,
        size:file.size,
        uploadedBy:uploadedBy,
        postId:postId,
        fileURL:fileURL
    });
};

module.exports = File;