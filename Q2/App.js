import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup'
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {useEffect, useState} from 'react';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from 'react-bootstrap/Card';

function CreateBookForm(){
  const {register, handleSubmit, formState:{errors}} = useForm();
  const [message, setMessage] = useState({});
  const onSubmit = async (data) => {
    const res = await axios.post('http://127.0.0.1:5000/book', data);
    console.log(res.data);
    setMessage(res.data || {});
  }
  return (
  <Container className="my-5">
    <h1 className="text-center">Create Book</h1>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formBasicBookTitle" >
        <Form.Label>Book Title</Form.Label>
        <Form.Control    
        type="text"
        {...register('BookTitle', {required: 'Book Title is required'})}
        />
        {errors.BookTitle && <p className="text-danger">{errors.BookTitle.message}</p>}
      </Form.Group>
      <Form.Group controlId="formBasicISBN" >
        <Form.Label>ISBN</Form.Label>
        <Form.Control  
        type="text"
        {...register('ISBN', {required: 'ISBN is required'})}
        />
        {errors.ISBN && <p className="text-danger">{errors.ISBN.message}</p>}
      </Form.Group>
      <Form.Group controlId="formBasicAuthor" >
        <Form.Label>Author</Form.Label>
        <Form.Control 
        type="text"
        {...register('Author', {required: 'Author is required'})}
        />
        {errors.Author && <p className="text-danger">{errors.Author.message}</p>}
      </Form.Group>
      <Form.Group controlId="formBasicCategory">
        <Form.Label>Category</Form.Label>
        <Form.Select className="my-2" {...register('Category')}>
          <option>Science</option>
          <option>Technology</option>
          <option>Agriculture</option>
          <option>Sports</option>
          <option>Comic</option>
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="formBasicQuantity" >
        <Form.Label>Quantity</Form.Label>
        <Form.Control 
        type="number"
        {...register('Quantity', {required: 'Quantity is required'})}
        />
        {errors.Quantity && <p className="text-danger">{errors.Quantity.message}</p>}
      </Form.Group>
      <div className="text-center mt-3">
        <Button type="submit" >
          Submit
        </Button>
      </div>
      {message.success && <p className="text-success text-center">{message.success}</p>}
      {message.error && <p className="text-danger text-center">{message.error}</p>}
    </Form>
  </Container>)
}

function SearchBook() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [book, setBook] = useState({});

  const onSubmit = async (data) => {
    const res = await axios.get(`http://127.0.0.1:5000/book/${data.ISBN}`);
    setBook(res.data || {});
  };

  return (
    <Container className="my-5">
      <h1 className="text-center">Search Book</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="formBasicSearch" className="d-flex align-items-center">
          <Form.Control
            type="text"
            className="me-3"
            placeholder="ISBN"
            {...register('ISBN', { required: 'Please enter a valid ISBN' })}
          />
          <Button type="submit">Search</Button>
        </Form.Group>
        {errors.ISBN && <p className="text-danger">{errors.ISBN.message}</p>}
      </Form>

      {book.error && <p className="text-danger">{book.error}</p>}
      {book.BookTitle && (
        <div className="mt-4">
          <Card>
            <Card.Body>
              <Card.Title className="text-center">{book.BookTitle}</Card.Title>
              <Card.Text>
                <p><strong>ISBN:</strong> {book.ISBN}</p>
                <p><strong>Author:</strong> {book.Author}</p>
                <p><strong>Category:</strong> {book.Category}</p>
                <p><strong>Quantity:</strong> {book.Quantity}</p>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      )}
    </Container>
  );
}

function DeleteBook(){
  const {register, handleSubmit, formState: {errors}} = useForm();
  const [message, setMessage] = useState({});
  const onSubmit = async (data) => {
    const res = await axios.delete(`http://127.0.0.1:5000/book/${data.ISBN}`);
    setMessage(res.data || {});
  }
  return (<Container className="my-5">
    <h1 className="text-center">Delete Book</h1>
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group controlId="formBasicSearch" className="d-flex align-items-center">
        <Form.Control 
        type="text" 
        className="me-3" 
        placeholder="ISBN"
        {...register('ISBN', {required:'Please enter a valid ISBN'})}
        />
        <Button type="submit" >
          Search
        </Button>
      </Form.Group>
      {errors.ISBN && <p className="text-danger">{errors.ISBN.message}</p>}
    </Form>
    {message.error && <p className="text-danger">{message.error}</p>}
    {message.success && <p className="text-success">{message.success}</p>}
  </Container>);
}

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:5000/book');
        setBooks(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  return (
    <Container className="my-5">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
          <h1 className="text-center">Books</h1>
          <ListGroup>
            {books.map((book) => (
              <ListGroup.Item key={book._id}>
                <h5 className='text-center'>{book.BookTitle}</h5>
                <p><strong>Author:</strong> {book.Author}</p>
                <p><strong>ISBN:</strong> {book.ISBN}</p>
                <p><strong>Category:</strong> {book.Category}</p>
                <p><strong>Quantity:</strong> {book.Quantity}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
}

function App(){
  return (<Router>
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand>LMN</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">Books</Nav.Link>
          <Nav.Link as={Link} to="/create">Create</Nav.Link>
          <Nav.Link as={Link} to="/search">Search</Nav.Link>
          <Nav.Link as={Link} to="/delete">Delete</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
    <Routes>
      <Route path="/" element={<Books />}/>
      <Route path="/create" element={<CreateBookForm />}/>
      <Route path="/search" element={<SearchBook/>}/>
      <Route path="/delete" element={<DeleteBook />}/>
    </Routes>
  </Router>)
}

export default App;
