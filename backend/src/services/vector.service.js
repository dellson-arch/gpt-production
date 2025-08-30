// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone')

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

// Create a dense index with integrated embedding
const cohortgptIndex = pc.Index('cohort-gpt');

async function createMemory({vectors , metadata , messageId}){[
  await cohortgptIndex.upsert([{
    id:messageId,  //upsert ke andar id honi hi chahiye 
    values : vectors,
    metadata
  }])
]}

async function queryMemory({queryVector , limit = 5 , metadata}){ // yeh queryMemory ka wahi kaam hai similar se messages ko lekeaana bas
    const data = await cohortgptIndex.query({
        vector: queryVector,
        topK : limit,
        filter: metadata ? metadata : undefined,
        includeMetadata : true
    })
  
    return data.matches
}

module.exports = {createMemory , queryMemory}
//metadata : hum objects ki form me data store karenge
//topK : matlab hum jo search kar rahe hai uski closest kuch data rahegi toh sabse closest jo 5 data rahegi wo hume lake do 

