export const OrderModel = (sequelize, DataTypes) =>{

  const Order = sequelize.define('order', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  orderDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  }
},{
  timestamps: true
});         

return Order

}