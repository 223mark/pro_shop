import { Link, useParams } from "react-router-dom"
import {
    useGetOrderDetailsQuery,
    usePayOrderMutation,
    useGetPayPalClientIdQuery,
    useDeliverOrderMutation
} from "../slices/orderApiSlice";
import { Row, Col, ListGroup, ListGroupItem, Image, Card, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import {toast} from 'react-toastify';
// components
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useSelector } from "react-redux";
import { useEffect } from "react";


const OrderScreen = () => {
    const { id: orderId } = useParams();

    const { data: order, isLoading, error, refetch } = useGetOrderDetailsQuery(orderId);
  // console.log(order);
    
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const { data: paypal, isLoading: loadingPaypal, error: errorPaypal } = useGetPayPalClientIdQuery();

    const [deliverOrder, {isLoading:loadingDeliver}]  = useDeliverOrderMutation(orderId);
    
    // Paypal Script
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer()
    
    const { userInfo } = useSelector((state) => state.auth);
    // console.log(userInfo);

    useEffect(() => {
        if (!errorPaypal && !loadingPaypal && paypal.clientId) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: "resetOptions",
                    value: {
                        'clientId': paypal.clientId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, paypalDispatch, errorPaypal, loadingPaypal])

    // paypal btns
    async function onApproveTest() {
        await payOrder({ orderId, details: { payer: {} } });
        refetch();
        toast.success("Payment successful");
    }
    function onApprove(data, actions) {
        // from paypel docs
        return actions.order.capture().then( async function (details) {
            try {
                await payOrder({ orderId, details })
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.message)
            }
        })
    }
    function onError(error) {
        toast.error(error.message)
    }
    function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
    }
    
    const deliverHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order delivered");
        } catch (error) {
            toast.error(error?.data?.message || error.message)
        }
    }
     
    return (isLoading
        ? <Loader />
        : error ? <Message variant="danger">{error}</Message>
            : (
                <>
                    <Row>
                        <Col md={8}>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <h2>Shipping</h2>
                                    <p>
                                        <strong>Name: </strong>
                                        {order.user.name}
                                    </p>
                                    <p>
                                        <strong>Email: </strong>
                                        {order.user.email}
                                    </p>
                                    <p>
                                        <strong>Address: </strong>
                                        {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}, 
                                    </p>
                                    <p>
                                        {order.isDelivered ? (
                                            <Message variant='success'>
                                                Delivered on {order.deliveredAt}
                                        </Message>
                                        ) : (
                                                <Message variant='danger'>
                                                    Not Delivered
                                                </Message>
                                        )}
                                    </p>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h2>Payment Method</h2>
                                    <p>
                                        <strong>Method: </strong>
                                        {order.paymentMethod}
                                    </p>
                                    {order.isPaid ? (
                                            <Message variant='success'>
                                                Paid on {order.paidAt}
                                        </Message>
                                        ) : (
                                                <Message variant='danger'>
                                                    Not Paid
                                                </Message>
                                        )}
                                </ListGroupItem>
                                <ListGroupItem>
                                    <h2>Order Items</h2>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroupItem key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded/>
                                                </Col>
                                                <Col >
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                    
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x {item.price} = ${(item.qty*item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                            
                                        </ListGroupItem>
                                    ))}
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
                                            <Col>Items</Col>
                                            <Col>${order.itemsPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Shipping Price</Col>
                                            <Col>${order.shippingPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Tax</Col>
                                            <Col>${order.taxPrice}</Col>
                                        </Row>
                                        <Row>
                                            <Col>Total</Col>
                                            <Col>${order.totalPrice}</Col>
                                        </Row>
                                        {
                                            !order.isPaid && (
                                                <ListGroupItem>
                                                    {loadingPay && <Loader />} 
                                                    
                                                    {isPending ? <Loader /> : (
                                                        <div>
                                                            {/* <Button onClick={(onApproveTest)} style={{ marginBottom: '10px' }}>
                                                                Test Pay Order
                                                                
                                                            </Button> */}
                                                            <div>
                                                                    <PayPalButtons
                                                                        createOrder={createOrder}
                                                                        onApprove={onApprove}
                                                                    onError={onError}></PayPalButtons>
                                                                </div>
                                                        </div>
                                                    )}
                                                </ListGroupItem>
                                            )
                                        }
                                        {
                                            loadingDeliver && <Loader/>
                                        }
                                        {
                                            userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered &&
                                                (
                                                <ListGroupItem>
                                                    <Button
                                                        type='submit'
                                                        className="btn btn-block"
                                                        onClick={deliverHandler}
                                                    >
                                                        Mark as Delivered
                                                    </Button>
                                              </ListGroupItem>
                                          )
                                        }
                                    </ListGroupItem>
                                </ListGroup>
                            </Card>
                        </Col>
                    </Row>
                </>
                
        ))
}

export default OrderScreen