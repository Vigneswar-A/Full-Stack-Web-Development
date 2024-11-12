import React from 'react';
import {Form, Container, Button, Card, Row, Col, Nav, Navbar, ListGroup} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';

function AddProductForm(){
    const {register, handleSubmit, formState: {errors}, reset} = useForm();
    const [message, setMessage] = useState({});
    const onSubmit = async (data) => {
        const res = await axios.post('http://127.0.0.1:5000/product', data);
        setMessage(res.data || {});
        reset();
    }
    return (
    <Container>
        <h1 className="text-center">Add Product</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formBasicProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Enter Product Name"
                {...register('productName', {required: 'Product Name is required!'})}
                />
                {errors.productName && <p className='text-danger'>{errors.productName.message}</p>}
            </Form.Group>
            <Form.Group controlId="formBasicProductID">
                <Form.Label>Product ID</Form.Label>
                <Form.Control 
                type="text" 
                placeholder="Enter Product ID"
                {...register('productID', {required: 'Product ID is required!'})}
                />
                {errors.productID && <p className='text-danger'>{errors.productID.message}</p>}
            </Form.Group>
            <Form.Group controlId="formBasicProductPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control 
                type="number" 
                placeholder="Enter Product Price"
                {...register('price', {required: 'Product Price is required!'})}
                />
                {errors.price && <p className='text-danger'>{errors.price.message}</p>}
            </Form.Group>
            <Form.Group controlId="formBasicProductCategory">
                <Form.Label>Category</Form.Label>
                <Form.Select {...register('category')}>
                    <option>Home</option>
                    <option>Kitchen</option>
                    <option>Electronics</option>
                    <option>Clothings</option>
                    <option>Books</option>
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="formBasicProductStock">
                <Form.Label>Stock</Form.Label>
                <Form.Control 
                type="number" 
                placeholder="Enter Product Stock"
                {...register('stock', {required: 'Product Stock is required!'})}
                />
                {errors.stock && <p className='text-danger'>{errors.stock.message}</p>}
            </Form.Group>
            <div className="text-center mt-3">
                <Button type="submit" className="mt-3" variant="success">
                    Submit
                </Button>
            </div>
            {message.success && <p className="text-success text-center">{message.success}</p>}
            {message.error && <p className="text-danger text-center">{message.error}</p>}
        </Form>
    </Container>
    );
}

function Search()
{
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [product, setProduct] = useState({});
    const onSubmit = async (data) => {
        const product = await axios.get(`http://127.0.0.1:5000/product/${data.productID}`);
        setProduct(product.data || {});
    }
    return (
    <Container>
        <h1 className="text-center">Search Product</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="d-flex align-items-center">
                <Form.Control 
                type="text"
                placeholder="Enter Product ID"
                className="me-3"
                {...register('productID')}
                />
                <Button type='submit'>
                    Search
                </Button>
            </Form.Group>
        </Form>
        {product.productID && 
        <Card className="my-5">
        <Card.Title className="text-center">{product.productName}</Card.Title>
        <Card.Body>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Product ID</strong></Col>
                <Col xs={6} className="text-center">{product.productID}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Price</strong></Col>
                <Col xs={6} className="text-center">{product.price}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Category</strong></Col>
                <Col xs={6} className="text-center">{product.category}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Stock</strong></Col>
                <Col xs={6} className="text-center">{product.stock}</Col>
            </Row>
            </Card.Body>
        </Card>}    
    </Container>
    )
}


function DeleteProduct()
{
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [message, setMessage] = useState({});
    const onSubmit = async (data) => {
        const res = await axios.delete(`http://127.0.0.1:5000/product/${data.productID}`);
        setMessage(res.data || {});
    }
    return (
    <Container>
        <h1 className="text-center">Delete Product</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="d-flex align-items-center">
                <Form.Control 
                type="text"
                placeholder="Enter Product ID"
                className="me-3"
                {...register('productID')}
                />
                <Button type='submit' variant="danger">
                    Delete
                </Button>
            </Form.Group>
        </Form>
        {message.success && <p className="text-success text-center">{message.success}</p>}
        {message.error && <p className="text-danger text-center">{message.error}</p>}
    </Container>
    )
}

function Products(){
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axios.get('http://127.0.0.1:5000/product');
            setProducts(res.data || []);
            setLoading(false);
        };
        fetchProducts();
    }, [])

    return (
    <Container>
        <h1 className="text-center">Products</h1>
        {loading && <h2 className="text-center mt-5">Loading...</h2>}
        <ListGroup>
            {products.map((product) => (
                <ListGroup.Item key={product._id}>
            <Row className="mb-2">
            <Col xs={12} className="text-center"><strong>{product.productName}</strong></Col>   
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Product ID</strong></Col>
                <Col xs={6} className="text-center">{product.productID}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Price</strong></Col>
                <Col xs={6} className="text-center">{product.price}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Category</strong></Col>
                <Col xs={6} className="text-center">{product.category}</Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} className="text-center"><strong>Stock</strong></Col>
                <Col xs={6} className="text-center">{product.stock}</Col>
            </Row>
            </ListGroup.Item>      
            ))}
            </ListGroup>
    </Container>
    )
}

function App(){
    return (
    <Router>
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">ABC</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/add">Add</Nav.Link>
                    <Nav.Link as={Link} to="/search">Search</Nav.Link>
                    <Nav.Link as={Link} to="/delete">Delete</Nav.Link>
                </Nav>
             </Container>
        </Navbar>
       
        <Routes>
            <Route path="/" element={<Products />} />
            <Route path="/add" element={<AddProductForm />} />
            <Route path="/search" element={<Search />} />
            <Route path="/delete" element={<DeleteProduct />} />
        </Routes>
    </Router>
    )   
}

export default App;
