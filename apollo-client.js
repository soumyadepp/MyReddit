import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
    uri: process.env.STEPZEN_URL || "http://localhost:5001/api/rafting-toad",
    fetchOptions:{
        mode:'no-cors',
    },
    headers:{
        ContentType: "application/json",
        Authorization: `APIKey ${process.env.STEPZEN_API_KEY}`, 
        'Access-Control-Allow-Origin': "*",
    },
    cache: new InMemoryCache(),
})

export default client;
