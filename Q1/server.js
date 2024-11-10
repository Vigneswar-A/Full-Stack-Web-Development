import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

// initialise database
const employeeSchema = new mongoose.Schema({
    EmployeeName: String,
    Designation: String,
    Department: String,
    JoiningDate: Date,
});

employeeSchema.virtual('EmployeeID').get(function(){
    return this._id;
});

const Employee = mongoose.model('Employee', employeeSchema);

async function initDB(){
    await mongoose.connect('mongodb://127.0.0.1:27017');
    await Employee.deleteMany({});
}

initDB();

// initialise express server
const app = express();

app.use(express.json());
app.use(cors());


app.post('/employee', async (req, res, next) => {
    const employee = new Employee(req.body);
    res.json(await employee.save());
});

app.patch('/employee', async (req, res, next) => {
    const {id, Designation} = req.body;
    res.json(await Employee.findByIdAndUpdate(id, {Designation}, { new: true }));
});

app.get('/employee/:id', async (req, res, next) => {
    const {id} = req.params;
    res.json(await Employee.findById(id));
});

app.listen(5000, '0.0.0.0', () => {
    console.log('Listening on http://0.0.0.0:5000');
});
