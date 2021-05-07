import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
const URI = 'mongodb+srv://dekpo:qi08xn6@cluster0.aiexe.mongodb.net/sample_airbnb?retryWrites=true&w=majority';
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology:true}, (err) =>{
    console.log('CONNECTED TO MONGODB !!!');
});
const myModel = mongoose.model('airbnb',new mongoose.Schema({}),'listingsAndReviews');
const count = myModel.find().countDocuments();
count.exec((err,result)=>{
    console.log(result);
});
const myMongoMethod = (request,response)=>{
    const skip = request.query.skip ? parseInt(request.query.skip) : 0;
    const limit = request.query.limit ? parseInt(request.query.limit) : 10;
    const country_code = request.query.country ? request.query.country : "US";
    const search = request.query.search ? request.query.search : "Room";
    const q = new RegExp(search);
    const filter = {$and: [{name: q },{"address.country_code": country_code}] }  ;

    const listing = myModel.find(filter,{id:1,name:1,listing_url:1,address:1,summary:1})
    .skip(skip)
    .limit(limit);

    listing.exec((err,result)=>{
        response.send(result);
    });
}
const app = express();
app.use(cors());
app.listen(3000);
app.get('/', myMongoMethod );