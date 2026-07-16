const mongoose = require('mongoose')

const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://deepakshrivas440:deepak123@nodepractice.kysiuez.mongodb.net/Devtinder');
}

module.exports = {
    connectDB,
}