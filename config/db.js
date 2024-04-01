const mongoose = require('mongoose')

const connectDb = async () => {
    try {   
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.MONGO_URI)
          console.log('connected to mongodb')
    }catch(err) {
        console.log(err.message)
    }
}

module.exports = connectDb