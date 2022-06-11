export default {
  up: async (queryInterface) =>
    queryInterface.bulkInsert("Games", [
      {
        gameState: "{}",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("Games", null);
  },
};
