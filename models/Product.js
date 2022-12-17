export const ProductModel = (sequelize, DataTypes) =>{

  const Product = sequelize.define('product', {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  }
},{
  timestamps: false
});

return Product

}