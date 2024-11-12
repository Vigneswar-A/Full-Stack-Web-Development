import cors from 'cors';
import express from 'express';
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: String, 
    productID: {
        type: String,
        unique: true,
    },
    price: Number,
    category: String,
    stock: Number
});

const Product = mongoose.model('product', productSchema);

async function initDB()
{
    await mongoose.connect('mongodb://127.0.0.1:27017');
    await Product.deleteMany({});
}

initDB();

const app = express();

app.use(express.json());
app.use(cors());

app.post('/product', async (req, res) => {
    try{
        const product = new Product(req.body);
        await product.save();
        res.json({success: 'Product was successfully added!'});
    }
    catch(e)
    {
        if (e.code === 11000)
        {
            res.json({error: 'Product ID is already used!'});
        }else{
            console.log(e);
            res.json({error: 'Something went wrong!'});
        }
    }
});

app.get('/product/:id', async (req, res) => {
    const product = await Product.findOne({productID: req.params.id});
    res.json(product);
})

app.delete('/product/:id', async (req, res) => {
    const result = await Product.deleteOne({productID: req.params.id});
    if (result.deletedCount > 0){
        res.json({success: 'Product was deleted successfully!'});
    }else{
        res.json({error: 'Product was not found!'});
    }
});

app.get('/product', async (req, res) => {
    const products = await Product.find({});
    res.json(products);
})

app.listen(5000, '0.0.0.0', () => {
    console.log(`listening on http://127.0.0.1:5000/`);
})

