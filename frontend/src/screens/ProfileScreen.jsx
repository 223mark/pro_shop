// dependecies
import { useEffect, useState } from 'react';
import { useProfileMutation } from '../slices/userApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap';
import { Col, Row ,Form, FormGroup, FormLabel, FormControl, Button, Table} from 'react-bootstrap';
import { toast } from 'react-toastify';
import {FaTimes} from 'react-icons/fa'

// componentes
import { setCredential } from '../slices/authSlice';
import {useGetMyOrdersQuery} from '../slices/orderApiSlice';
import Message from '../components/Message'
import Loader from '../components/Loader'

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();


    const { userInfo } = useSelector(state => state.auth);

    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
    
    const {data:orders, isLoading, error} = useGetMyOrdersQuery();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email)
        }
    }, [userInfo,userInfo.name, userInfo.email])

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Password doesnot match');
        } else {
            try {
                const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
                dispatch(setCredential(res));
                toast.success("Profile updated");
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }
    return (
        <Row>
            <Col md={3}>
                <h3>User Profile</h3>
                <Form onSubmit={submitHandler}>
                    <FormGroup controlId='name' className='my-2'>
                        <FormLabel>Name</FormLabel>
                        <FormControl
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e)=> setName(e.target.value)}
                        >
                            
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId='email' className='my-2'>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        >
                            
                        </FormControl>
                    </FormGroup>
                    <FormGroup controlId='password' className='my-2'>
                        <FormLabel>Password</FormLabel>
                        <FormControl
                            type='password'
                            placeholder='Enter Passowrd'
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                        >
                            
                        </FormControl>
                       
                        
                    </FormGroup>
                     <FormGroup controlId='confirmpsw' className='my-2'>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl
                            type='password'
                            placeholder='Enter confirm password'
                            value={confirmPassword}
                            onChange={(e)=> setConfirmPassword(e.target.value)}
                        >
                            
                            </FormControl>
                    
                    </FormGroup>
                    <Button type='submit' variant='primary' className='my-2'>
                        Update
                    </Button>
                    {loadingUpdateProfile && <Loader/>}
                </Form>
            </Col>
            <Col md={9}>
                <h3>My Orders</h3>
                {isLoading ? 
                <Loader/>
                 : error ? (
                <Message variant="danger">
                    {error?.data?.message || error.error}    
                </Message>
                    ) : (
                            <Table striped hover responsive className='table-sm'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>DATE</th>
                                        <th>TOTAL</th>
                                        <th>PAID</th>
                                        <th>DELIVERED</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{order.createdAt.substring(0,10)}</td>
                                            <td>{order.totalPrice}</td>
                                            <td>{order.isPaid ? (
                                            order.paidAt.substring(0,10)
                                            ) : (
                                                    <FaTimes style={{ color: 'red' }}/>
                                            )}</td>
                                            <td>{order.isDelivered ? (
                                              order.deliveredAt.substring(0,10)
                                            ) : (
                                                    <FaTimes style={{ color:'red' }}/>
                                            )}</td>
                                            <td>
                                                <LinkContainer to={`/orders/${order._id}`}>
                                                    <Button className='btn-sm' variant='light'>
                                                        Details
                                                    </Button>
                                                </LinkContainer>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                
                    </Table>
                )}
            </Col>
        </Row>
  )
}

export default ProfileScreen