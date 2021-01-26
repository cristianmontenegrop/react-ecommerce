import React from 'react';
import { Row, Col } from 'react-bootstrap';
import products from '../products';
import Product from '../components/Product';

const HomeScreen = () => {
  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((item) => {
          return (
            <Col sm={12} md={6} lg={4} xl={3}>
              <Product product={item} />
              <h3>{item.name}</h3>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default HomeScreen;
