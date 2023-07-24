import { useEffect, useState } from "react"
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { Button, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const cart = useSelector(state => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate])

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder')
    }
    
  return (
      <FormContainer>
          <CheckoutSteps step1 step2 step3 />
          <h3 className="mt-2">Payment Method</h3>

          <Form className="mt-2" onSubmit={submitHandler}>
              <Form.Group>
                  <Form.Label as='legend'>Select Method</Form.Label>
                  <Col>
                      <Form.Check
                          type="radio"
                          className="my-2"
                          label="PayPal or Credit Card"
                          id="Pay Pal"
                          checked
                          onChange={(e)=> setPaymentMethod(e.target.value)} 
                      /
                      >
                  </Col>
              </Form.Group>
              <Button type="submit" variant="primary">
                  Continue
              </Button>
          </Form>
    </FormContainer>
  )
}

export default PaymentScreen