const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.29d8nwh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const tasksCollection = client.db("manage-myself").collection("tasks");

    // -------------------------------
    // jwt api's
    // app.post("/jwt", async (req, res) => {
    //   const user = req.body;
    //   console.log(user)
    //   const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //     expiresIn: "1h",
    //   });
    //   res.send({ token });
    // });

    // middlewares
    // const verifyToken = (req, res, next) => {
    //   console.log(req.headers);
    //   if (!req.headers.authorization) {
    //     return res.status(401).send({ message: "forbidden" });
    //   }
    //   const token = req.headers.authorization.split(" ")[1];
    //   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    //     if (err) {
    //       return res.status(401).send({ message: "forbidden" });
    //     }
    //     req.decoded = decoded;
    //     next();
    //   });
    // };
    // -----------------------------
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    app.get("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await tasksCollection.findOne(query)
      res.send(result);
    });

    app.patch("/task/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: item.title,
          description: item.description,
          email: item.email,
          deadline: item.deadline,
          priority: item.priority,
          status: item.status
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/task/:id", async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          title: item.title,
          description: item.description,
          email: item.email,
          deadline: item.deadline,
          priority: item.priority,
          status: item.status
        },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.get("/ongoing/:email", async (req, res) => {
      const query = { email: req.params.email, status: "ongoing" };
      console.log(query);
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/tasks/:email',async (req,res)=>{
      const email = req.params.email

      const todoQuery = {email: email, status: "to-do"}
      const ongoingQuery = {email: email, status: "ongoing"}
      const completedQuery = {email: email, status: "completed"}

      const tasks = {
        todo: await tasksCollection.find(todoQuery).toArray(),
        ongoing: await tasksCollection.find(ongoingQuery).toArray(),
        completed: await tasksCollection.find(completedQuery).toArray()
      }
      // const result = await tasksCollection.find(query).toArray()
      
      res.send(tasks)
    })

    app.get("/completed/:email", async (req, res) => {
      const query = { email: req.params.email, status: "completed" };
      console.log(query);
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/to-do/:email", async (req, res) => {
      const query = { email: req.params.email, status: "to-do" };
      console.log(query);
      const result = await tasksCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      // const query = { _id: id}
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/task/updateStatus/:id", async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: { status },
      };
      const result = await tasksCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Manager is here");
});
app.listen(port, () => {
  console.log(`Your Manager is on port ${port}`);
});
