import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import crypto from 'crypto';

const studentSchema = new mongoose.Schema({
    name: String, 
    ID: {
        type: String,
        required: true,
        unique: true
    },
    course: String,
    year: Number,
    email: String
});

const Student = mongoose.model('student', studentSchema);

async function initDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017');
    await Student.deleteMany({});
}

initDB();

const app = express();
const adminCookie = crypto.randomBytes(64).toString('hex');

const authenticate = (req, res, next) => {
    try{
        if (req.headers.authorization?.split(' ')[1] === adminCookie){
            req.authenticated = true;
        } else{
            req.authenticated = false;
        }
    } catch (e){
        console.log(e);
        req.authenticated = false;
    }
    return next();
}

app.use(express.json());
app.use(cors());
app.use(authenticate);

app.post('/login', (req, res) => {
    const {username, password } = req.body;
    if (username === "admin" && password === "secret_admin_password")
    {
        res.status(200).json({auth: adminCookie});
    } else{
        res.status(403).json({error: 'Invalid credentials!'});
    }
});

app.post('/student', async (req, res) => {
    if (!req.authenticated)
    {
        res.status(403).json({error: 'Access denied!'});
        return;
    }
    try{
        const student = new Student(req.body);
        await student.save();
        res.json({success: 'Successfully added student!'});
    }
    catch(e){
        if (e.code === 11000)
        {
            res.json({error: 'Student with ID already exists!'});
        } else{
            console.log(e);
            res.json({error: 'Something went wrong!'});
        }
    }
});

app.get('/student/:id', async (req, res) => {
    const student = await Student.findOne({ID: req.params.id});
    res.json(student);
});

app.delete('/student/:id', async (req, res) => {
    if (!req.authenticated)
    {
        res.status(403).json({error: 'Access denied!'});
        return;
    }
    const result = await Student.deleteOne({ID: req.params.id});
    if (result.deletedCount > 0){
        res.json({success: 'Student deleted successfully!'});
    } else {
        res.json({error: 'Student was not found!'});
    }
});

app.get('/student', async (req, res) => {
    const students = await Student.find({});
    res.json(students);
});

app.listen(5000, '0.0.0.0', () => {
    console.log(`Server listening on http://127.0.0.1:5000/`);
})
