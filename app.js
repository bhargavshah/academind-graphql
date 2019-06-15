const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphqlSchema = require('./graphql/schema');
const graphqlResolvers = require('./graphql/resolvers');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}));

/**
 * Mongo DB Atlas connection does not work on home wifi. Run mongodb on your machine.
 */
// mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
//     process.env.MONGO_PASSWORD
// }@bhargav-practice-agury.mongodb.net/${
//     process.env.MONGO_DB
// }?retryWrites=true&w=majority`, {
//     useNewUrlParser: true
// })

mongoose.connect('mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb')
.then(res => {
    console.log('Mongo DB connection successful!');
    app.listen(4500);
})
.catch(err => {
    console.log('Error connecting to Mongo Cloud', err);
});
