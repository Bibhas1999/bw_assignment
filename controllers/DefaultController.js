import { where } from "sequelize";
import db from "../config/dbConfig.js";
import { sequelize } from "../config/dbConfig.js";
import HTTPException from "../ErrorHandlers/HTTPExceptions.js";
import ValidationError from "../ErrorHandlers/ValidationExceptions.js";
const Product = db.products;
const Order = db.orders;
const OrderProductMap = db.order_product_map;

//get all orders
export const getOrders = async (req, res) => {
  try {
    let orders = await Order.findAll();

    if (!orders || orders.length == 0) {
      throw new HTTPException("No Orders Found", 404);
    }
    //finding product of each orders
    let mapped_product = 0;
    for (let order in orders) {
      mapped_product = await OrderProductMap.findAndCountAll({
        where: {
          order_id: orders[order].id,
        },
      });
      orders[order].dataValues.count = mapped_product.count;
    }

    return res
      .status(200)
      .json({ orders: orders, msg: "Order Fetched Successfully" });
  } catch (error) {
    res.status(error.statusCode).send({ error: error });
  }
};

//get single order
export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError("Order ID is required.", 400);
    }

    let order = await Order.findOne({
      where: {
        id: id,
      },
    });

    if (!order) {
      //   return res.status(404).send({ msg: "No Order Found" });
      throw new HTTPException("No order is associated with this id", 404);
    }
    let mapped_product = await OrderProductMap.findAndCountAll({
      where: {
        order_id: order.id,
      },
    });
    if(!mapped_product){
        throw new HTTPException("No order is associated with this id", 404);
    }
    let products = []
    for(let i=0;i<mapped_product.rows.length;i++){
        let product = await Product.findOne({where:{id:mapped_product.rows[i].dataValues.product_id}})
        products.push(product)
    }
    let product_arr = []
    for (let i = 0; i < products.length; i++) {
        product_arr.push(products[i].dataValues)
    }
    let order_data = {
      id: order.id,
      orderDesc:order.orderDescription,
      createdAt: order.createdAt,
      count: mapped_product.count,
      products:product_arr
    };
    return res.status(200).json({ order: order_data });
  } catch (error) {
    if (error instanceof HTTPException) {
      res.status(error.statusCode).send({ error: error });
    } else if (error instanceof ValidationError) {
      res.status(400).send({ error: error });
    } else {
      res.status(500).send({ error: error });
    }
  }
};

//create order
export const createOrder = async (req, res) => {
  try {
    const { orderDesc, products } = req.body;

    if (!orderDesc) {
      throw new ValidationError("Order Description is required.", 400);
    }
    if (products instanceof Array == false) {
      throw new ValidationError("Products must be an array.", 400);
    }
    if (!products || products.length == 0) {
      throw new ValidationError("No Product Selected.", 400);
    }

    const result = db.sequelize.transaction(async (t) => {
      let order = await Order.create({
        orderDescription: orderDesc,
      });

      if (!order) {
        // return res.status(400).send({error:"Couldn't Create Order. Something Went Wrong!"})
        throw new HTTPException(
          "Couldn't Create Order. Something Went Wrong!",
          424
        );
      }

      for (let product in products) {
        let findproduct = await Product.findOne({
          where: { id: products[product].id },
        });

        if (!findproduct || findproduct.length == 0) {
          return res.status(400).send({
            error: {
              statusCode: 424,
              messege: "No Product found associated with this id",
            },
          });
          // throw new ValidationError('No Product found associated with this id')
        }

        let order_has_product = await OrderProductMap.create({
          order_id: order.id,
          product_id: products[product].id,
        });
      }
      return res
        .status(201)
        .send({ msg: "Order Created Successfully", transaction_id: t.id });
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      res.status(error.statusCode).send({ error: error });
    } else if (error instanceof ValidationError) {
      res.status(400).send({ error: error });
    } else {
      res.status(500).send({ error: error });
    }
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderDesc} = req.body;

    if (!id) {
      throw new ValidationError("Order id is required");
    }
    if (!orderDesc) {
        throw new ValidationError("Order Description is required");
    }

    const findOrder = await Order.findOne({
      where: {
        id: id,
      },
    });

    if (!findOrder) {
      throw new HTTPException("No Order is associated with this id",404);
    }
    const result = db.sequelize.transaction(async (t) => {
      let order = await Order.update(
        {
          orderDescription: orderDesc,
        },
        { where: { id: id } }
      );
      if (!order) {
        throw new HTTPException("Couldn't Update Order. Something Went Wrong!",500);
      }
      return res
        .status(200)
        .send({ msg: "Order Updated Successfully", transaction_id: t.id });
    });
  } catch (error) {
    if (error instanceof HTTPException) {
        res.status(error.statusCode).send({ error: error });
      } else if (error instanceof ValidationError) {
        res.status(400).send({ error: error });
      } else {
        res.status(500).send({ error: error });
      }
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError("Order id is required");
    }
    let findorder = await Order.findOne({ where: { id: id } });
    if (!findorder) {
      throw new HTTPException("No order is found",404);
    }
    const result = db.sequelize.transaction(async (t) => {
      let order = await Order.destroy({ where: { id: id } });
      if (!order) {
        throw new HTTPException("Couldn't Update Order. Something Went Wrong!",500)
      }

      let order_has_product = await OrderProductMap.findAll({
        where: { order_id: id },
      });

      if (!order_has_product || order_has_product.length == 0) {
        return res.send({ msg: "No Products to remove" });
      }
      for (let product in order_has_product) {
        await OrderProductMap.destroy({
          where: { order_id: order_has_product[product].order_id },
        });
      }
      return res
        .status(200)
        .send({ msg: "Order Deleted Successfully", transaction_id: t.id });
    });
  } catch (error) {
    if (error instanceof HTTPException) {
        res.status(error.statusCode).send({ error: error });
      } else if (error instanceof ValidationError) {
        res.status(400).send({ error: error });
      } else {
        res.status(500).send({ error: error });
      }
  }
};

export const getProducts = async (req, res) => {
  try {
    let products = await Product.findAll();
    if (products.length == 0) {
      throw new HTTPException("No Products Found!",500)
    }
    return res.status(200).json(products);
  } catch (error) {
    if (error instanceof HTTPException) {
        res.status(error.statusCode).send({ error: error });
      } else if (error instanceof ValidationError) {
        res.status(400).send({ error: error });
      } else {
        res.status(500).send({ error: error });
      }
    
  }
};

export const deleteProductFormOrder = async (req, res) => {
  try {
    const { id, p_id } = req.body;

    if (!id) {
      throw new ValidationError("Order id is required");
    }
    if (!p_id) {
      throw new ValidationError("Product Id is required");
    }
    let order_id = await Order.findOne({
      where: {
        id: id,
      },
    });
    let product_id = await Product.findOne({ where: { id: p_id } });

    if (!order_id) {
      throw new ValidationError("No order associated with this id");
    }

    if (!product_id) {
      throw new ValidationError("No product associated with this id");
    }

    const result = await db.sequelize.transaction(async (t) => {
      let mapped_product = await OrderProductMap.findAndCountAll({
        where: {
          order_id: id,
        },
      });
      if (mapped_product.count == 1) {
        throw new ValidationError("Order must have at least one product");
      }
      let deleted = await OrderProductMap.destroy({
        where: { order_id: id, product_id: p_id },
      });
      if (deleted) {
        res.status(201).send({ msg: "Product Removed from Order", transaction_id: t.id });
      }
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      res.status(error.statusCode).send({ error: error });
    } else if (error instanceof ValidationError) {
      res.status(400).send({ error: error });
    } else {
      res.status(500).send({ error: error });
    }
  }
};

export const addProductToOrder = async (req, res) => {
  try {
    const { id, products } = req.body;

    if (!id) {
      throw new ValidationError("Order id is required");
    }

    let order_id = await Order.findOne({
      where: {
        id: id,
      },
    });

    if (!order_id) {
      throw new ValidationError("No order associated with this id");
    }

    if(products instanceof Array == false){
        throw new ValidationError("Products must be an array");
    }

    if(products.length == 0){
        throw new ValidationError("No Products Selected");
    }
   
    const result = db.sequelize.transaction(async(t)=>{
        for(let product in products){
            let find = await Product.findOne({where:{id:products[product].id}})
            if(find === null){
             throw new ValidationError("This product doesnot exist. id"+ "-"+products[product].id);
            }
            let order_has_product = await OrderProductMap.create({
                order_id: id,
                product_id: products[product].id,
              });
            if(order_has_product){
             return res.status(201).send({ msg: "Product Added to order successfully", transaction_id: t.id }); 
            }
         }
    })
    


  } catch (error) {
    if (error instanceof HTTPException) {
      res.status(error.statusCode).send({ error: error });
    } else if (error instanceof ValidationError) {
      res.status(400).send({ error: error });
    } else {
      res.status(500).send({ error: error });
    }
  }
};
