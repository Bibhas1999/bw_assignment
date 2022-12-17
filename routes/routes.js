import express from 'express'
import { getOrders,getOrder,createOrder,updateOrder,deleteOrder,getProducts,deleteProductFormOrder,addProductToOrder } from '../controllers/DefaultController.js'
const router=express.Router()

router.get('/api/order',getOrders)
router.get('/api/order/:id',getOrder)
router.get('/api/products/',getProducts)
router.post('/api/orders',createOrder)
router.put('/api/orders/:id',updateOrder)
router.delete('/api/orders/:id',deleteOrder)

router.post('/api/delete/order/product',deleteProductFormOrder)
router.post('/api/add/order/product',addProductToOrder)
export default router 