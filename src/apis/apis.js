export const orders_urls = {
    get_orders:'http://localhost:4000/api/order',
    get_order:'http://localhost:4000/api/order',
    add_order:'http://localhost:4000/api/orders',
    update_order:'http://localhost:4000/api/orders',
    delete_order:'http://localhost:4000/api/orders',
    get_products:'http://localhost:4000/api/products',
    delete_order_product:'http://localhost:4000/api/delete/order/product',
    add_order_product:'http://localhost:4000/api/add/order/product'
    
}
export const headers = {
   read:{
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Access-Control-Allow-Methods': 'GET'  
    },
   write:{
    'Access-Control-Allow-Origin':'http://localhost:3000',
    'Access-Control-Allow-Methods': 'POST,PUT,DELETE',  
    'Content-Type': 'application/json'
   }, 
}
