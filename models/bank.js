/*
create table bank(
  bankId integer(50) not null auto_increment primary key,
  bankName varchar(30) not null,
 	userId varchar(50),
  foreign key(userId) references user(userId)
);
*/

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('bank', {
      bankId: {
        type: DataTypes.INTEGER(50),
        allowNull: false,
        unique: true,
        autoIncrement:true,
        primaryKey: true,
      },
      bankName: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      /*
      userId: {
        type: DataTypes.STRING(50),
      },
      */
    }, {
      timestamps: false,
    });
  };