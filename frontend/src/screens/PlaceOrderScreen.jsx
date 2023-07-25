// dependencies
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { Col, ListGroup, ListGroupItem, Row, Image, Card, Button } from "react-bootstrap";
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

// components
import Loader from "../components/Loader";
import CheckoutSteps from "../components/CheckoutSteps";
import Message from "../components/Message";
import {useCreateOrderMutation} from '../slices/orderApiSlice';
import { clearCartItem } from "../slices/cartSlice";


const PlaceOrderScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    
    const [createOrder, { isLoading, error }] = useCreateOrderMutation();

    const placeOrderHandler = async () => {
        try {
            const res = await createOrder({
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            }).unwrap();
            dispatch(clearCartItem());
            navigate(`/orders/${res._id}`);
        } catch (error) {
            toast.error(error)
            
        }
    }

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment')
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate])
  return (
      <>
          <CheckoutSteps step1 step2 step3 step4 />
          <Row>
              <Col md={8}>
                  <ListGroup variant="flush">
                      <ListGroupItem>
                          <h2>Shipping</h2>
                          <p>
                              <strong>Address:</strong>
                              {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                          </p>
                      </ListGroupItem>
                      <ListGroupItem>
                          <h2>Payment Method</h2>
                          <strong>Method: </strong>
                          {cart.paymentMethod}
                      </ListGroupItem>
                      <ListGroupItem>
                          <h2>Order Items</h2>
                          {cart.cartItems.length === 0 ? (
                          <Message >Your cart is empty</Message>
                          ) : (
                                  <ListGroup variant="flush">
                                      {cart.cartItems.map((item,index) => (
                                          <ListGroupItem key={index}>
                                              <Row>
                                                  <Col md={2}>
                                                      <Image 
                                                          style={{ height: "80px", }}
                                                          src={item.image}
                                                          alt={item.name}
                                                          fluid
                                                          roundedd
                                                      />
                                                  </Col>
                                                  <Col>
                                                      <Link to={`/product/${item._id}`}>
                                                          {item.name}
                                                      </Link>
                                                  </Col>
                                                  <Col md={4}>
                                                      {item.qty} x ${item.price} = ${Number(item.qty*item.price).toFixed(2)}
                                                  </Col>
                                              </Row>
                                          
                                           </ListGroupItem>
                                     ))}
                                      
                                  </ListGroup>
                          )}
                      </ListGroupItem>
                  </ListGroup>
              </Col>
              <Col md={4}>
                  <Card>
                      <ListGroup variant="flush">
                          <ListGroupItem>
                              <h2>Order Summary</h2>
                          </ListGroupItem>
                          <ListGroupItem>
                              <Row>
                                  <Col>Items: </Col>
                                  <Col>{cart.itemsPrice}</Col>
                              </Row>
                          </ListGroupItem>
                          <ListGroupItem>
                              <Row>
                                  <Col>Shipping: </Col>
                                  <Col>{cart.shippingPrice}</Col>
                              </Row>
                          </ListGroupItem>
                          <ListGroupItem>
                              <Row>
                                  <Col>Tax: </Col>
                                  <Col>{cart.taxPrice}</Col>
                              </Row>
                          </ListGroupItem>
                          <ListGroupItem>
                              <Row>
                                  <Col>Total: </Col>
                                  <Col>{cart.totalPrice}</Col>
                              </Row>
                          </ListGroupItem>
                          <ListGroupItem>
                              {error && <Message variant='danger'> {error}</Message>}
                          </ListGroupItem>
                          <ListGroupItem>
                              <Button type="button" className="btn-block"
                                  disabled={cart.cartItems.length === 0}
                                  onClick={placeOrderHandler}>
                                  Place Order
                              </Button>
                              {isLoading && <Loader/>}
                          </ListGroupItem>
                      </ListGroup>
                </Card>
              </Col>
              {/* <Loader/> */}
          </Row>
      </>
  )
}

export default PlaceOrderScreen