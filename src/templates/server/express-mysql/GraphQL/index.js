import express from 'express'
import bodyParser from 'body-parser'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'

import { makeExecutableSchema } from 'graphql-tools'

import typeDefs from './schema'
import resolvers from './resolvers'
import models from './models'

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

const app = express()

app.use(
    '/graphiql',
    graphiqlExpress({
        endpointURL: '/graphql',
    })
)

app.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress({
        schema,
        context: {
            models,
        },
    })
)

models.sequelize.sync().then(() => app.listen(5600, () => console.log('Server is running at the port 5600')))
