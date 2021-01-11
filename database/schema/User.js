const mongoose = require('mongoose');
var column =  mongoose.Schema({
    id: String,
    name: String,
    type: String,
    key : Number,
    length: Number,
    default: Number,
    null: Boolean,
});
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    database: [{
            id: String,
            name: String,
            routes:String,
            tables: [{
                id: String,
                name: String,
                columns: [column]
            }]
        }],
        
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);