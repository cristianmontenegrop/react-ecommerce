import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Message from '../components/Message';
import {
  getOrderDetails,
  payOrder,
  clearOrderDetails,
  updateOrderShipping,
} from '../actions/orderActions';
import {
  ORDER_PAY_RESET,
  ORDER_UPDATE_SHIPPING_RESET,
} from '../constants/orderConstants';
import { PayPalButton } from 'react-paypal-button-v2';

const OrderScreen = ({ history, match }) => {
  const dispatch = useDispatch();

  const orderId = match.params.id;

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const orderUpdateShipping = useSelector((state) => state.orderUpdateShipping);
  const { success: shippingUpdateSuccess, orderShipping } = orderUpdateShipping;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    }
    console.log('useEffect Triggered');
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal');
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if ((order && order._id !== orderId) || shippingUpdateSuccess) {
      dispatch(clearOrderDetails());
      dispatch({ type: ORDER_UPDATE_SHIPPING_RESET });
      dispatch(getOrderDetails(orderId));
    }

    if (!order || successPay) {
      dispatch(getOrderDetails(orderId));
      dispatch({ type: ORDER_PAY_RESET });
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [
    dispatch,
    history,
    userInfo,
    order,
    orderId,
    successPay,
    orderShipping,
    shippingUpdateSuccess,
  ]);

  if (!loading) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const updateShippingStatus = () => {
    if (window.confirm('Are you sure?')) {
      dispatch(updateOrderShipping(orderId));
    }
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                {' '}
                <strong>Name: </strong>
                {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on{' '}
                  {moment(order.deliveredAt).format('MMMM Do YYYY, h:mm:ss a')}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Paid on{' '}
                  {moment(order.paidAt).format('MMMM Do YYYY, h:mm:ss a')}
                </Message>
              ) : (
                <Message variant='danger'>Not paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => {
                    return (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.price.toFixed(2)} = $
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Row>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? (
                      <Loader />
                    ) : (
                      <PayPalButton
                        amount={order.totalPrice.toFixed(2)}
                        onSuccess={successPaymentHandler}
                      />
                    )}
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card>
          </Row>
          {userInfo && userInfo.isAdmin && order.isPaid ? (
            <Row>
              <Card className='mt-4'>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h4>Shipping Status</h4>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button onClick={() => history.push('/admin/orderlist')}>
                      Go Back
                    </Button>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Button onClick={updateShippingStatus}>
                      Update to {order.isDelivered ? 'Not Shipped' : 'Shipped'}
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Row>
          ) : (
            ''
          )}
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
