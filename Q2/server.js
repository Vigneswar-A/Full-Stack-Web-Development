import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

// initialise database
const bookSchema = new mongoose.Schema({
    BookTitle: String,
    ISBN: {
        type: String,
        unique: true
    },
    Author: String,
    Category: String,
    Quantity: Number
});

const Book = mongoose.model('Book', bookSchema);

async function initDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017');
    await Book.deleteMany({});
}

initDB();

// initialise express server
const app = express();

app.use(express.json());
app.use(cors());


app.post('/book', async (req, res, next) => {
    try{
        const book = new Book(req.body);
        await book.save();
        res.json({success: 'Successfully created book!'});
    }
    catch(e)
    {
        if (e.code === 11000){
            res.json({error: 'Book with ISBN already exists!'});
        }
    }
});

app.delete('/book/:isbn', async (req, res, next) => {
    const {isbn} = req.params;
    const result = await Book.deleteOne({ISBN: isbn});
    if (result.deletedCount){
        res.json({success: 'Succesfully deleted book!'})
    } else{
        res.json({error: 'Could not find book with ISBN'});
    }
});

app.get('/book/:isbn', async (req, res, next) => {
    const {isbn} = req.params;
    res.json((await Book.findOne({ISBN: isbn})) || {error: 'Could not find book with ISBN!'});
});

app.get('/book', async (req, res, next) => {
    res.json(await Book.find({}));
});

app.listen(5000, '0.0.0.0', () => {
    console.log('Listening on http://0.0.0.0:5000');
});
