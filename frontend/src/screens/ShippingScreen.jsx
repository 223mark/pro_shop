import { useState } from "react"
import FormContainer from "../components/FormContainer"
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;
    console.log(shippingAddress, 'address');
    // ? means it can be undefined
    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate('/payment')
    }

  return (
      <FormContainer>
          <CheckoutSteps step1 step2 />
          <h3>Shipping</h3>

          <Form onSubmit={(e)=> submitHandler(e)}>
              <Form.Group controlId="address" className="my-2">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                      type="text"
                      value={address}
                      placeholder="Enter Address"
                      onChange={(e) => setAddress(e.target.value)}
                  />
              </Form.Group>
              <Form.Group controlId="city" className="my-2">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                      type="text"
                      value={city}
                      placeholder="Enter City"
                      onChange={(e) => setCity(e.target.value)}
                  />
              </Form.Group>
              <Form.Group controlId="postalCode" className="my-2">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control
                      type="text"
                      value={postalCode}
                      placeholder="Enter Postal Code"
                      onChange={(e) => setPostalCode(e.target.value)}
                  />
              </Form.Group>
              <Form.Group controlId="countery" className="my-2">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                      type="text"
                      value={country}
                      placeholder="Enter Country"
                      onChange={(e) => setCountry(e.target.value)}
                  />
              </Form.Group>
              <Button type="submit" variant="dark" className="mt-2">
                  Continue
              </Button>
          </Form>
          
    </FormContainer>
  )
}

export default ShippingScreen