import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keyword }) => {
  if (keyword) {
    keyword += ` technology gadgets cheap`;
  } else {
    keyword = `technology gadgets cheap`;
  }
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description}></meta>
        <meta name='keyword' content={keyword}></meta>
      </Helmet>
    </>
  );
};

Meta.defaultProps = {
  title: 'Welcome to e-commerce',
  description: 'A place to find all electronics you need',
};

export default Meta;
