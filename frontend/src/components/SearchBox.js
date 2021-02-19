import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const history = useHistory();

  useEffect(() => {
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  }, [history, keyword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push('/');
    }
  };

  return (
    <>
      <Form inline onSubmit={submitHandler}>
        <Form.Control
          type='text'
          name='q'
          placeholder='Search Products...'
          className='mr-sm-2 ml-sm-5'
          onChange={(e) => setKeyword(e.target.value)}
        ></Form.Control>
        <Button type='submit' variant='outline-success' className='p-2'>
          Search
        </Button>
      </Form>
    </>
  );
};

export default SearchBox;
