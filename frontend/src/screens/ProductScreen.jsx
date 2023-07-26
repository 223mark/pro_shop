// dependecies
import { Link, useParams, useNavigate } from "react-router-dom"
import { Row, Col, ListGroup, Image, Card, Form, Button, ListGroupItem, FormGroup, FormLabel, FormControl } from 'react-bootstrap';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {toast} from 'react-toastify'
// components
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";

// slicies
import { addToCart } from "../slices/cartSlice";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productApiSlice";
import Meta from "../components/Meta";



const ProductScreen = () => {
  const { id: productId } = useParams();
  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingreview }] = useCreateReviewMutation();

  const { userInfo } = useSelector(state => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  }
  
  const submitHandler = async(e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment
      }).unwrap();
      refetch();
      toast.success('Review Submitted');
      setRating(0);
      setComment('');

    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }


  return (
    <>
      <Link className="btn btn-light my-3" to='/'>
        Go Back
      </Link>
      {
        isLoading ? 
          (
            <Loader/>
          )
          : error ? (
             <Message variant='danger'>
               {error?.data?.message || error.error}
            </Message>
          ) : (
              <>
                <Row>
                  <Meta title={product.name}/>
        <Col md={5}>
          <Image src={product.image} alt="product.name" fluid/>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush" >
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating value={product.rating} text={`${product.numReviews} reviews`}/>
            </ListGroup.Item>
            <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
            <ListGroup.Item>description: {product.description}</ListGroup.Item>
            
          </ListGroup>
          
          
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>$ {product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>{product.countInStock > 0 ? 'In stock' : 'Out of stock'}</strong>
                  </Col>
                </Row>
                      </ListGroup.Item>
                      {product.countInStock > 0 && (
                        <ListGroup.Item>
                          <Row>
                            <Col>Qty</Col>
                            <Col>
                              <Form.Control as="select"
                                value={qty}
                                onChange={(e) => setQty(Number(e.target.value))}
                              >
                                {[...Array(product.countInStock).keys()].map((x) => (
                                  <option key={x + 1} value={x + 1} >
                                    {x+1}
                                  </option>
                                ) )}
                              </Form.Control>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      )}
              <ListGroup.Item>
                        <Button
                          onClick={addToCartHandler}
                          className="btn-block" type="button"
                  disabled={product.countInStock === 0}>
                  Add to Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
                </Row>
                {/* review section */}
                <Row className="review mt-4">
                  <Col md={6}>
                    <h4>Reviews</h4>
                    {
                      product.reviews.length ===0 && <Message>No reviews</Message>
                    }
                    <ListGroup variant="flush">
                      {product.reviews.map((review) => (
                        <ListGroupItem key={review._id}>
                          <strong>{review.name}</strong>
                          <Rating value={review.rating} />
                          <p>{review.createdAt.substring(0, 10)}</p>
                          <p>{review.comment}</p>
                         </ListGroupItem>
                      ))}
                      <ListGroupItem>
                        <h5>Write a review</h5>
                        {loadingreview && <Loader />}
                        {
                          userInfo ? (
                            <Form onSubmit={(e)=> submitHandler(e)}>
                              <FormGroup controlId="rating" className="my-2">
                                <FormLabel>Rating</FormLabel>
                                <FormControl
                                  as='select'
                                  value={rating}
                                  onChange={(e)=> setRating(e.target.value)}
                                >
                                  <option value=''>Select....</option>
                                  <option value='1'>1-- Poor</option>
                                  <option value='2'>2-- Fair</option>
                                  <option value='3'>3-- Good</option>
                                  <option value='4'>4-- Very Good</option>
                                </FormControl>
                              </FormGroup>
                              <FormGroup controlId="comment" className="my-2">
                                <FormLabel>Comment</FormLabel>
                                <FormControl
                                  as='textarea'
                                  row='3'
                                  value={comment}
                                  onChange={(e)=> setComment(e.target.value)}
                                ></FormControl>
                              </FormGroup>
                              <Button
                                disabled={loadingreview}
                                type="submit"
                                variant="primary"
                              >
                               Submit
                              </Button>
                          </Form>
                          ) : (
                              <Message>
                                Please <Link to='/login'>sign in</Link> to write a review
                              </Message>
                          )
                        }
                      </ListGroupItem>
                    </ListGroup>
                  </Col>
                  
          </Row>
              
              </>
          )
      }
      
    </>
  )
}

export default ProductScreen