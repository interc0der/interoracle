//see: http://dev.apollodata.com/tools/graphql-tools/resolvers.html

import controller from "../../controller/index"; 

const resolvers = {
    Query: {
        weightedAvg: (root :any,args:any,context:any,info:any) => {
            controller.getWeightedAverage(args.token)
        }
    },
    Mutation: {
        createMessage: (args:any) => {
            console.log(args)
    }   
    }
};

export default resolvers