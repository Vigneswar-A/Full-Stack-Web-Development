import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Add() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    const result = await axios.post('http://127.0.0.1:5000/employee', data);
    setMessage(`Successfully added employee with id: ${result.data._id}`);
  };

  return (
    <Container className="my-4">
      <h1>Add Employee</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-4">
        <Form.Group controlId="formBasicName">
          <Form.Label>Employee Name</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Employee Name" 
            {...register("EmployeeName", { required: "Employee name is required" })}
          />
          {errors.EmployeeName && <p className="text-danger">{errors.EmployeeName.message}</p>}
        </Form.Group>
        <Form.Group controlId="formBasicDesignation">
          <Form.Label>Designation</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Designation"
            {...register("Designation", { required: "Designation is required" })} 
          />
          {errors.Designation && <p className="text-danger">{errors.Designation.message}</p>}
        </Form.Group>
        <Form.Group controlId="formBasicDepartment">
          <Form.Label>Department</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Department" 
            {...register("Department", { required: "Department is required" })}
          />
          {errors.Department && <p className="text-danger">{errors.Department.message}</p>} 
        </Form.Group>
        <Form.Group controlId="formBasicJoiningDate">
          <Form.Label>Joining Date</Form.Label>
          <Form.Control 
            type="date"
            {...register("JoiningDate", { required: "Joining Date is required" })}
          />
          {errors.JoiningDate && <p className="text-danger">{errors.JoiningDate.message}</p>}
        </Form.Group>
        <Button variant="primary" type="submit" className="my-2">
          Submit
        </Button>
      </Form>
      {message && <p className="text-success">{message}</p>}
    </Container>
  );
}

function Update() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    const result = await axios.patch('http://127.0.0.1:5000/employee', data);
    setMessage(`Successfully updated employee with id: ${result.data._id}`);
  };

  return (
    <Container className="my-4">
      <h1>Update Employee Details</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-4">
        <Form.Group controlId="formBasicId">
          <Form.Label>Employee ID</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Employee ID" 
            {...register("id", { required: "Employee ID is required" })}
          />
          {errors.id && <p className="text-danger">{errors.id.message}</p>}
        </Form.Group>
        <Form.Group controlId="formBasicDesignation">
          <Form.Label>Designation</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Designation"
            {...register("Designation", { required: "Designation is required" })} 
          />
          {errors.Designation && <p className="text-danger">{errors.Designation.message}</p>}
        </Form.Group>
        <Button variant="primary" type="submit" className="my-2">
          Submit
        </Button>
      </Form>
      {message && <p className="text-success">{message}</p>}
    </Container>
  );
}

function Search() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    try {
      const result = await axios.get(`http://127.0.0.1:5000/employee/${data.id}`);
      console.log(result.data);
      setEmployee(result.data);
      setMessage('');
    } catch (error) {
      setMessage("Employee not found");
      setEmployee(null);
    }
  };

  return (
    <Container className="my-4">
      <h1>Search Employee by ID</h1>
      <Form onSubmit={handleSubmit(onSubmit)} className="my-4">
        <Form.Group controlId="formBasicId">
          <Form.Label>Employee ID</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Employee ID" 
            {...register("id", { required: "Employee ID is required" })}
          />
          {errors.id && <p className="text-danger">{errors.id.message}</p>}
        </Form.Group>
        <Button variant="primary" type="submit" className="my-2">
          Search
        </Button>
      </Form>
      {message && <p className="text-danger">{message}</p>}
      {employee && (
        <div className="mt-3">
          <h3>Employee Details:</h3>
          <p><strong>Name:</strong> {employee.EmployeeName}</p>
          <p><strong>Designation:</strong> {employee.Designation}</p>
          <p><strong>Department:</strong> {employee.Department}</p>
          <p><strong>Joining Date:</strong> {new Date(employee.JoiningDate).toLocaleDateString('en-US')}</p>
        </div>
      )}
    </Container>
  );
}

const App = () => {
  return (
    <Router >
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Employees Manager</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/add">Add</Nav.Link>
            <Nav.Link href="/update">Update</Nav.Link>
            <Nav.Link href="/">Search</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Routes>
        <Route path="/" element={<Search />}></Route>
        <Route path="/add" element={<Add />}></Route>
        <Route path="/update" element={<Update />} ></Route>    
      </Routes>
    </Router>
  );
};

export default App;
