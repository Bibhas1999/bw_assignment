import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv'
import {OrderModel} from '../models/Order.js';
import {ProductModel} from '../models/Product.js';
import {OrderProductMapModel} from '../models/OrderProductMap.js';
dotenv.config()
export const sequelize = new Sequelize(
 process.env.DB_NAME,
 process.env.DB_USER,
 process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  }
);
sequelize.authenticate().then(()=>{
    console.log('MYSQL connected successfully')
}).catch(err=>console.log(err))

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize
db.products = ProductModel(sequelize,DataTypes)
db.orders = OrderModel(sequelize,DataTypes)
db.order_product_map = OrderProductMapModel(sequelize,DataTypes)
db.sequelize.sync({force:false}).then(()=>{
    console.log('re-sync done')
}).catch(err => console.log(err))
export default db