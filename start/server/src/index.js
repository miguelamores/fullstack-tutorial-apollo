const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const { createStore } = require('./utils')

const LaunchApi = require('./datasources/launch')
const UserApi = require('./datasources/user')

const store = createStore() 

const server = new ApolloServer({
    typeDefs,
    dataSources: () => ({
        launchApi: new LaunchApi(),
        userApi: new UserApi({ store })
    })
});

server.listen().then(({ url }) => {
    console.log(`Server  ready at ${url}`);
});
