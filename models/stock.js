/*
create table stock(
  stockNumber integer(10) not null,
  stockName varchar(30) not null,
  stockPrice integer(50) not null,
  stockAmount integer(10) not null
 	userId varchar(50) -> foreign key
);
*/

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('stock', {
      stockNumber: {
        type: DataTypes.CHAR(6),
        allowNull: false,
      },
      stockName: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      stockPrice: {
        type: DataTypes.INTEGER(50),
        allowNull: false
      },
      stockAmount: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
    }, {
      timestamps: false,
    });
  };