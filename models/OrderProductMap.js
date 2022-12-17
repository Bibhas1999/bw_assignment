export const OrderProductMapModel = (sequelize, DataTypes) =>{

const OrderProductMap = sequelize.define('order_product_map', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
  },
  order_id: {
    type: DataTypes.INTEGER,
  },
});

return OrderProductMap

}