import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Games extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Games.init(
    {
      gameState: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Games",
    }
  );
  return Games;
};
