import React from 'react'
import { Route,Routes } from 'react-router-dom'
import AddOrder from '../components/AddOrder'
import Home from '../components/Home'
import NotFound from '../components/NotFound'
import EditOrder from '../components/EditOrder'
const CustomRoutes = () => {
  return (
    <>
    <Routes>
        <Route exact path='/' element={<Home/>} />
        <Route path='/add/order' element={<AddOrder/>} />
        <Route path='/edit/order/:id' element={<EditOrder/>} />
        <Route path='*' element={<NotFound/>} />
    </Routes>
    </>
  )
}

export default CustomRoutes