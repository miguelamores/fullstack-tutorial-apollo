const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils')
const isEmail = require('isemail')

const LaunchApi = require('./datasources/launch')
const UserApi = require('./datasources/user')

const resolvers = require('./resolvers')

const store = createStore() 

const server = new ApolloServer({
    context: async ({ req }) => {
      const auth = (req.headers && req.headers.authorization) || ''
      const email = Buffer.from(auth, 'base64').toString('ascii')

      if (!isEmail.validate(email)) return { user: null }

      const users = await store.users.findOrCreate({ where: { email } })
      const user = users && users[0] ? users[0] : null

      return { user: { ...user.dataValues } }
    },
    typeDefs,
    resolvers,
    dataSources: () => ({
        launchApi: new LaunchApi(),
        userApi: new UserApi({ store })
    })
});

server.listen().then(({ url }) => {
    console.log(`Server  ready at ${url}`);
});
