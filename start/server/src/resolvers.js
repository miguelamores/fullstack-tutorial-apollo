const { paginateResults } = require('./utils')

module.exports = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchApi.getAllLaunches()
      allLaunches.reverse()

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches
      })

      return {
        launches,
        cursor: launches.length ? launches[launches.length -1].cursor : null,
        hasMore: launches.length
          ? launches[launches.length -1].cursor !== allLaunches[allLaunches.length -1].cursor
          : false
      }
    },
    launch: (_, { id }, { dataSources }) =>
      dataSources.launchApi.getLaunchById({ launchId: id }),
    me: async (_, __, { dataSources }) =>
      dataSources.findOrCreateUser()
  },
  Mission: {
    missionPatch: (mission, { size } = { size: 'LARGE' }) => {
      return size === 'SMALL'
        ? mission.missionPatchSmall
        : mission.missionPatchLarge
    }
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) =>
      dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id })
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser()

      if (!launchIds.length) return []

      return (
        dataSources.launchApi.getLaunchesByIds({
          launchIds
        }) || []
      )
    }
  }
}