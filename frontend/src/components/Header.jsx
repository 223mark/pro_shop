import { useState } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap'

const Header = () => {
    // const { cartItems } = useSelector((state) => state.cart);

    // const { cartItems, taxPrice } = useSelector((state) => state.cart);
    const { cartItems } = useSelector((state) => state.cart);
    console.log(cartItems);
    
  return (
      <header>
          <Navbar bg='dark' variant='dark' expand='md' collapseOnSelect>
              <Container>
                  {/* .Brand is sub-component of navbar component */}
                  <LinkContainer to='/'>
                       <Navbar.Brand >
                      ProShop
                  </Navbar.Brand>
                  </LinkContainer>
                  <Navbar.Toggle aria-controls='basic-navbar-env'></Navbar.Toggle>
                  <Navbar.Collapse id='basic-navbar-nav'>
                      <Nav className='ms-auto'>
                          <LinkContainer to='/cart'>
                              <Nav.Link >
                                  <FaShoppingCart /> Cart
                                  {/* {cartItems.length > 0 && (
                                      <Badge pill bg="success" style={{ marginLeft: "5px" }}>
                                          { cartItems.reduce((a,c)=> a + c.qty) }
                                      </Badge>
                                  )} */}
                              </Nav.Link>
                              
                          </LinkContainer>
                          <LinkContainer to='/login'>
                              <Nav.Link ><FaUser /> Sign In</Nav.Link>
                          </LinkContainer>
                          
                      </Nav>
                  </Navbar.Collapse>
              </Container>
          </Navbar>
    </header>
  )
}

export default Header