import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Game, { foreignKey: "gameId" });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: {
          args: false,
          msg: "Please enter your username",
        },
        unique: {
          args: true,
          msg: "Username already exists",
        },
      },
      password: DataTypes.STRING,
      personalBest: DataTypes.INTEGER,
      gameId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 1,
        references: {
          model: "Games",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
