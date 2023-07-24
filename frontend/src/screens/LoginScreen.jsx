import { useEffect, useState } from "react"
import { Button, Form, Row, Col } from "react-bootstrap";
import {Link, useLocation, useNavigate} from 'react-router-dom'
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from '../slices/userApiSlice';
import {setCredential} from '../slices/authSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import Loader from '../components/Loader';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    const { search } = useLocation();
    const searhParam = new URLSearchParams(search);
    const redirect = searhParam.get('redirect') || '/';
    // console.log(redirect);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }

    }, [userInfo, redirect, navigate])

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log('click');

        try {
            const res = await login({ email, password }).unwrap();
            // we set data to localStorage 
            dispatch(setCredential({ ...res }));
            navigate(redirect);
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }

    }

  return (
      <FormContainer>
          <h1>Sign In</h1>

          <Form onSubmit={(e)=> submitHandler(e)}>
              <Form.Group controlId='email' className="my-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e)=> setEmail(e.target.value)}
                  >              
                  </Form.Control>
              </Form.Group>
              <Form.Group controlId='password' className="my-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                      type="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e)=> setPassword(e.target.value)}
                  >              
                  </Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" className="mt-2">
                  Sign In
              </Button>
              {isLoading && <Loader/>}
          </Form>
          <Row className="py-3">
              <Col>
                  New Customers? <Link to={redirect ? `/register?redirect=${redirect}`: 'register'}>Register</Link>
              </Col>
          </Row>
    </FormContainer>
  )
}

export default LoginScreen