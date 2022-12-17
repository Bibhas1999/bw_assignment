import React from 'react'
import { Form } from 'react-bootstrap'
import { useState } from 'react'
const SearchBar = ({getSearchQuery}) => {
    const [query, setQuery] = useState('');
    const setValue = (data) =>{
        setQuery(data)
        getSearchQuery(data)
    }
  return (
    <Form>
        <Form.Control type="text" placeholder="Search for Orders...." value={query} onChange={(e)=>setValue(e.target.value)} onKeyUp={(e)=>setValue(e.target.value)} />
    </Form>
  )
}

export default SearchBar