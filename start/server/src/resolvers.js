module.exports = {
  Query: {
    launches: async (_, __, { dataSources }) =>
      dataSources.launchApi.getAllLaunches(),
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchApi.getLaunchById({ launchId: id }),
    me: async (_, __, { dataSources }) =>
      dataSources.findOrCreateUser()
  }
}