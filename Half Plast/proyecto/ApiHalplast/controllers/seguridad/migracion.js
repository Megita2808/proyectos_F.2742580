// const { MongoClient } = require('mongodb');

// const uri =  process.env.MONGODB_CNN;
// const client = new MongoClient(uri);

// const migrarUsuarios = async () => {
//     try {
//         await client.connect();
//         const db = client.db("Halplast");
//         const collection = db.collection("usuarios");

//         await collection.updateMany(
//             { status: { $exists: false } },
//             { $set: { status: "activo" } }
//         );
//     } finally {
//         await client.close();
//     }
// };

// migrarUsuarios();
