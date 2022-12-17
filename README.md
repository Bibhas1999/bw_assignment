API DOCUMENTATION

URL  -  /api/order/   - Getting all orders

METHOD - GET

PARAMS - :id (order id)

BODY - N/A


URL  -  /api/order/:id   - Getting single order

METHOD - GET

PARAMS - :id (order id)

BODY - N/A



URL  -  /api/orders/   - Creating an Order 

METHOD - POST

BODY - { 
        "orderDesc":"This is for customer bibhas",
         "products":[{
            "id":1
               },
             {
              "id":3
             }
          ]}


URL  -  /api/orders/:id   - Updating an Order 

PARAMS - :id (order id)

METHOD - PUT

BODY - { 
        "orderDesc":"This is for customer bibhas",
       }
        

URL  -  /api/orders/:id   - Deleting an Order 

PARAMS - :id (order id)

METHOD - DELETE


URL  -  /api/products/   - Getting all products

PARAMS - N/A

METHOD - GET

BODY - N/A



URL  -  /api/delete/order/product   - Deleting product from an order 

PARAMS - N/A

METHOD - POST

BODY - { 
        "id":"1",
        "p_id":"3"
       }

URL  -  /api/add/order/product   - Adding product to order 

PARAMS - N/A

METHOD - POST

BODY - { 
        "id":"1",
        "products":[{
             "id":1
            }]
       }
