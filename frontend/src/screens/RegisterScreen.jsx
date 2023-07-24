import { useEffect, useState } from "react"
import { Button, Form, Row, Col } from "react-bootstrap";
import {Link, useLocation, useNavigate} from 'react-router-dom'
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from '../slices/userApiSlice';
import {setCredential} from '../slices/authSlice'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// components
import Loader from '../components/Loader';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // we can give register or anything we want
    const [register, { isLoading }] = useRegisterMutation();

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
        if (password !== confirmPassword) {
            toast.error("Password don't match")
        } else {
            try {
                const res = await register({ name, email, password }).unwrap();
                // we set data to localStorage 
                dispatch(setCredential({ ...res }));
                navigate(redirect);
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        
        }
    }

  return (
      <FormContainer>
          <h1>Sign Up</h1>

          <Form onSubmit={(e) => submitHandler(e)}>
              <Form.Group controlId='name' className="my-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e)=> setName(e.target.value)}
                  >              
                  </Form.Control>
              </Form.Group>
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
              <Form.Group controlId='confirmPassword' className="my-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                      type="password"
                      placeholder="Enter Confirm Password"
                      value={confirmPassword}
                      onChange={(e)=> setConfirmPassword(e.target.value)}
                  >              
                  </Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary" className="mt-2">
                  Register
              </Button>
              {isLoading && <Loader/>}
          </Form>
          <Row className="py-3">
              <Col>
                  Already have an account? <Link to={redirect ? `/login?redirect=${redirect}`: 'login'}>Login</Link>
              </Col>
          </Row>
    </FormContainer>
  )
    }

export default RegisterScreen;

