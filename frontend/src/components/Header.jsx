import { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Badge, Image, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector,  } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import {useNavigate} from 'react-router-dom';


import logo from '../assets/logo.png'
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/userApiSlice';

const Header = () => {
    
     
    const { cartItems } = useSelector((state) => state.cart);

    console.log(cartItems.length, 'count');
    const { userInfo } = useSelector((state) => state.auth);
    
    
    
    console.log(typeof(userInfo), 'type?');
    const navigate = useNavigate();
    const dispatch = useDispatch();
   
   
    
    // we can give whatever we want instead of logoutApiCall
     const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = () => {

        try {
            logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
    }
  return (
      <header>
          <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
              <Container>
                  {/* .Brand is sub-component of navbar component */}
                  <LinkContainer to='/'>
                       <Navbar.Brand >
                      <Image src={logo}/> Pro Shop
                  </Navbar.Brand>
                  </LinkContainer>
                  <Navbar.Toggle aria-controls='basic-navbar-env'></Navbar.Toggle>
                  <Navbar.Collapse id='basic-navbar-nav'>
                      <Nav className='ms-auto'>
                          <LinkContainer to='/cart'>
                              <Nav.Link >
                                  <FaShoppingCart /> Cart
                                  {
                                  cartItems.length > 0 && (
                                      <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                                           {cartItems.reduce((a, c) => a + c.qty, 0)}
                                      </Badge>
                                      )}
                                 
                              </Nav.Link>
                              
                          </LinkContainer>
                          {userInfo ? (
                              <NavDropdown title={userInfo.name} id="username">
                                  <LinkContainer to="/profile">
                                      <NavDropdown.Item>Profile</NavDropdown.Item>
                                  </LinkContainer>
                                  <NavDropdown.Item onClick={logoutHandler}>
                                      Logout
                                  </NavDropdown.Item>
                           </NavDropdown>
                          ): (
                                  <LinkContainer to='/login'>
                              <Nav.Link ><FaUser /> Sign In</Nav.Link>
                          </LinkContainer>
                          )}
                          
                          
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>
    </header>
  )
}

export default Header