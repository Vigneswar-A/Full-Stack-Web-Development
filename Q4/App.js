import React, { useEffect } from 'react';
import {Container, Form, Button, Card, Row, Col, Navbar, Nav, NavbarBrand, ListGroup} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {useState} from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate, Link} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import axios from 'axios';

axios.interceptors.request.use(async (req) => {
    const authToken = localStorage.getItem('auth');
    if (authToken) {
        req.headers.Authorization = `Bearer ${authToken}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

function Login({setAuthenticated}){
  const {register, handleSubmit, formState:{errors}} = useForm();
  const [message, setMessage] = useState({});
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
        const res = await axios.post('http://127.0.0.1:5000/login', data);
        setMessage({success: 'Logged in successfully!'});
        localStorage.setItem('auth', res.data.auth);
        if (res.status === 200) {
            setAuthenticated(true);
            navigate('/');
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            setMessage(error.response.data); 
            setAuthenticated(false);
        } else {
            console.log(error);
            setMessage({ error: 'Something went wrong!' });
        }
    }
  };
  return (
  <Container>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formBasicUsername">
        <Form.Label>
          User Name
        </Form.Label>
        <Form.Control 
        type="text"
        placeholder="Enter Username"
        {...register('username', {required: 'Username is required!'})}
        />
        {errors.username && <p className="text-danger">{errors.username.message}</p>}
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
        type="password"
        placeholder="Enter Password"
        {...register('password', {required: 'Password is required!'})}
        />
        {errors.password && <p className='text-danger'>{errors.password.message}</p>}
      </Form.Group>
      <div className='text-center mt-3'>
        <Button type='submit'>
          Submit
        </Button>
       </div>
    </Form>
    {message.error && <p className='text-danger'>{message.error}</p>}
    {message.success && <p className='text-success'>{message.success}</p>}
  </Container>
  )
}

function AddStudentForm(){
  const {register, handleSubmit, formState: {errors}, reset} = useForm();
  const [message, setMessage] = useState({});
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try{
      const res = await axios.post('http://127.0.0.1:5000/student', data);
      setMessage(res.data);
    }
    catch(e){
      if (e.response?.status === 403)
      {
        navigate('/login');
      } else{
        console.log(e);
        setMessage({error: 'Something went wrong!'});
      }
    }
  } 
  return (
  <Container>
    <h1 className='text-center'>Add Student</h1>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId='formBasicName'>
        <Form.Label>Name</Form.Label>
        <Form.Control 
        type="text"
        placeholder='Enter Student Name'
        {...register('name', {required: 'Student Name is required!'})}
        />
        {errors.name && <p className='text-danger'>{errors.name.message}</p>}
      </Form.Group>
      <Form.Group controlId='formBasicID'>
        <Form.Label>ID</Form.Label>
        <Form.Control 
        type="text"
        placeholder='Enter Student ID'
        {...register('ID', {required: 'Student ID is required!'})}
        />
        {errors.ID && <p className='text-danger'>{errors.ID.message}</p>}
      </Form.Group>
      <Form.Group controlId='formBasicCourse'>
        <Form.Label>Course</Form.Label>
        <Form.Control 
        type="text"
        placeholder='Enter Course Name'
        {...register('course', {required: 'Course name is required!'})}
        />
        {errors.course && <p className='text-danger'>{errors.course.message}</p>}
      </Form.Group>
      <Form.Group controlId='formBasicYear'>
        <Form.Label>Year</Form.Label>
        <Form.Select {...register('year')}>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option value="5">5 (M.Tech)</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId='formBasicEmail'>
        <Form.Label>Email</Form.Label>
        <Form.Control 
        type="text"
        placeholder='Enter Student Email'
        {...register('email', {required: 'Email name is required!'})}
        />
        {errors.email && <p className='text-danger'>{errors.email.message}</p>}
      </Form.Group>
      <div className='text-center mt-3'>
        <Button type='submit' className='px-5' variant='success'>
          Add
        </Button>
       </div>
    </Form>
     {message.error && <p className='text-danger'>{message.error}</p>}
     {message.success && <p className='text-success'>{message.success}</p>}
  </Container>)
}

function SearchStudent(){
  const {register, handleSubmit, formState: {errors}, reset} = useForm();
  const [student, setStudent] = useState({});
  const onSubmit = async ({ID}) => {
    const res = await axios.get(`http://127.0.0.1:5000/student/${ID}`);
    setStudent(res.data);
  }
  return (
  <Container>
    <h1 className='text-center'>Search Student</h1>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="d-flex align-items-center" controlId='formBasicID'>
        <Form.Control 
        type="text"
        placeholder='Enter Student ID'
        {...register('ID', {required: 'Student ID is required!'})}
        />
      <Button type='submit' className='ms-2'>Search</Button>
      </Form.Group>
    </Form>
    {errors.ID && <p className='text-danger'>{errors.ID.message}</p>}
    {student.ID && 
    <Card className='mt-5'>
      <Card.Title className='text-center'>{student.ID}</Card.Title>
      <Card.Body>
        <Row>
          <Col xs="6" className='text-center'><strong>Name</strong></Col>
          <Col xs="6" className='text-center'><p>{student.name}</p></Col>
        </Row>
        <Row>
          <Col xs="6" className='text-center'><strong>Course</strong></Col>
          <Col xs="6" className='text-center'><p>{student.course}</p></Col>
        </Row>
        <Row>
          <Col xs="6" className='text-center'><strong>Year</strong></Col>
          <Col xs="6" className='text-center'><p>{student.year}</p></Col>
        </Row>
        <Row>
          <Col xs="6" className='text-center'><strong>Email</strong></Col>
          <Col xs="6" className='text-center'><p>{student.email}</p></Col>
        </Row>
      </Card.Body>
    </Card>
    } 
  </Container>)
}

function DeleteStudent(){
  const {register, handleSubmit, formState: {errors}, reset} = useForm();
  const [message, setMessage] = useState({});
  const navigate = useNavigate();
  const onSubmit = async ({ID}) => {
    try{
      const res = await axios.delete(`http://127.0.0.1:5000/student/${ID}`);
      setMessage(res.data);
    }
    catch(e){
      if (e.response?.status === 403)
      {
        navigate('/login');
      } else{
        console.log(e);
        setMessage({error: 'Something went wrong!'});
      }
    }
  } 
  return (
  <Container>
    <h1 className='text-center'>Delete Student</h1>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="d-flex align-items-center" controlId='formBasicID'>
        <Form.Control 
        type="text"
        placeholder='Enter Student ID'
        {...register('ID', {required: 'Student ID is required!'})}
        />
      <Button type='submit' className='ms-2'>Search</Button>
      </Form.Group>
    </Form>
    {message.error && <p className='text-danger'>{message.error}</p>}
    {message.success && <p className='text-success'>{message.success}</p>}
  </Container>)
}

function Logout({setAuthenticated}){
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('auth');
    setAuthenticated(false);
    navigate('/');
  }, []);
}

function StudentsList(){
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get('http://127.0.0.1:5000/student');
      setStudents(res.data);
      setLoading(false);
    }
    fetchStudents();
  }, []);
  return (
  <Container>
    <h1 className='text-center'>Students</h1>
    {loading && <h2 className='text-center'>Loading...</h2>}
    <ListGroup>
      {students.map((student) => (
        <ListGroup.Item key={student._id}>
          <Row>
          <Col xs="6" className='text-center'><strong>Name</strong></Col>
          <Col xs="6" className='text-center'><p>{student.name}</p></Col>
        </Row>
        <Row>
          <Col xs="6" className='text-center'><strong>Course</strong></Col>
          <Col xs="6" className='text-center'><p>{student.course}</p></Col>
        </Row>
        <Row>
          <Col xs="6" className='text-center'><strong>Year</strong></Col>
          <Col xs="6" className='text-center'><p>{student.year}</p></Col>
        </Row>
        <Row>
          <Col xs="6" className='text-center'><strong>Email</strong></Col>
          <Col xs="6" className='text-center'><p>{student.email}</p></Col>
        </Row>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Container>)
}

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  return (
  <Router>
    <Navbar> 
      <Container>
        <Navbar.Brand as={Link} to="/">DEF</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/search">Search</Nav.Link>
          {authenticated && <Nav.Link as={Link} to="/add">Add</Nav.Link>}
          {authenticated && <Nav.Link as={Link} to="/delete">Delete</Nav.Link>}
        </Nav>
        <Nav>
        {!authenticated && <Nav.Link as={Link} to="/login">Login</Nav.Link>}
          {authenticated && <Nav.Link as={Link} to="/logout">Logout</Nav.Link>}
        </Nav>
      </Container>
    </Navbar>
    <Routes>
      <Route path="/" element={<StudentsList />}></Route>
      <Route path="/add" element={<AddStudentForm />}></Route>
      <Route path="/login" element={<Login setAuthenticated={setAuthenticated}/>}></Route>
      <Route path="/logout" element={<Logout setAuthenticated={setAuthenticated}/>}></Route>
      <Route path="/search" element={<SearchStudent />}></Route>
      <Route path="/delete" element={<DeleteStudent />}></Route>
    </Routes>
  </Router>
  );
};

export default App;
