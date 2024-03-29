const express = require('express')
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.port || 5000

require('dotenv').config()


//middleware

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dmnxhxd.mongodb.net/?retryWrites=true&w=majority`;


// const VerifyJWT = (req, res, next) => {
//   const authorization = req.header.authorization
//   if (!authorization) {
//     res.status(401).send({ error: true, message: "unauthorized access" })
//   }
//   console.log(authorization)
//   const token = authorization.split(' ')[1];
//   jwt.verify(token, process.env.Token, (err, decoded) => {
//     if (err) {
//       res.status(401).send({ error: true, message: "unauthorized access" })
//     }
//     req.decoded = decoded
//     next()
//   })

// }

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const doctorCollection = client.db('Easy-Med').collection('doctors')
    const userCollection = client.db('Easy-Med').collection('users')
    const doctor_request_Collection = client.db('Easy-Med').collection('doctor_request')
    const doctor_appointment = client.db('Easy-Med').collection('appointment')
    const patientAppointment = client.db('Easy-Med').collection('patient_appointment')
    const prescription_collection = client.db('Easy-Med').collection('prescrioption_collection')


    //jwt
    // app.post("/jwt", (req, res) => {
    //   const user = req.body;
    //   const token = jwt.sign(user?.email, process.env.Token, { expiresIn: '2h' })
    //   res.send({ token })
    // })

    //doctor collection

    // app.get('/doctors', async (req, res) => {
    //   let query = {};

    //   if (req.query?.email) {
    //     query = { email: req.query.email };
    //   }
    //   let result = await doctorCollection.find(query).toArray();
    //   res.send(result);
    // });

    app.get('/doctors', async (req, res) => {
      let query = {}
      if (req.query?._id) {
        query = { _id: new ObjectId(req.query._id) }
      }
      const result = await doctorCollection.find(query).toArray();
      // console.log(result)
      res.send(result)
    })

    app.get('/doctors/:email', async (req, res) => {
      let params = req.params.email
      query = { email: params }
      const doctor = await doctorCollection.find(query).toArray()
      res.send(doctor)
    })

    app.get('/speciality', async (req, res) => {
      let params = req.query.speciality
      query = { speciality: params }
      const doctor = await doctorCollection.find(query).toArray()
      res.send(doctor)
    })

    app.patch('/doctors', async (req, res) => {
      const { email } = req.query
      const updatedData = req.body
      let filter = {}
      if (email) {
        filter = { email }
      } else {
        console.log('email not found')
      }
      const result = await doctorCollection.updateOne(filter, { $set: updatedData })
      // console.log(result)
      res.send(result)
    })

    //admin middleware
    // const verifyAdmin = async (req, res, next) => {
    //   const email = req.decoded.email
    //   const query = { email: email }
    //   const user = await userCollection.findOne(query)
    //   if (user?.user_role !== 'admin') {
    //     res.status(401).send({ message: 'unauthorized access' })
    //   }
    //   next()
    // }


    app.delete('/doctors', async (req, res) => {
      let { _id } = req.query
      let filter = { _id: new ObjectId(_id) };
      const result = await doctorCollection.deleteOne(filter)
      console.log(result)
      res.send(result);
    })

    // user collection

    app.get('/users', async (req, res) => {
      let query = {};

      if (req.query?.email) {
        query = { email: req.query.email };
      }

      let result = await userCollection.find(query).toArray();
      res.send(result);
    });

    app.post('/users', async (req, res) => {
      let userInfo = req.body
      console.log(userInfo)
      const result = await userCollection.insertOne(userInfo);
      res.send(result)
    })

    app.patch('/users', async (req, res) => {
      const { email } = req.query
      const updatedData = req.body
      let filter = {}
      if (email) {
        filter = { email }
        console.log(filter)
      } else {
        console.log('email not found')
      }
      const result = await userCollection.updateOne(filter, { $set: updatedData })
      res.send(result)
    })

    app.delete('/users', async (req, res) => {
      let { email } = req.query
      console.log({ email })
      let filter = { email }
      const result = await userCollection.deleteOne(filter)
      res.send(result);
    })


    //doctor_request collection 

    app.post('/doctor_request', async (req, res) => {
      let DoctorInfo = req.body
      // console.log(DoctorInfo)
      const result = await doctor_request_Collection.insertOne(DoctorInfo)
      res.send(result)
    })

    app.get('/doctor_request', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      let result = await doctor_request_Collection.find(query).toArray();
      res.send(result);
    });

    app.delete('/doctor_request', async (req, res) => {
      let { _id } = req.query
      let filter = { _id: new ObjectId(_id) };
      const result = await doctor_request_Collection.deleteOne(filter)
      // console.log(result)
      res.send(result);
    })

    app.post('/doctor-appointment', async (req, res) => {
      const data = req?.body;
      const result = await doctor_appointment.insertOne(data)
      res.send(result)
    })



    //patient_collection

    app.post('/patient_appointment', async (req, res) => {
      let data = req?.body;
      // console.log(data)
      const result = await patientAppointment.insertOne(data)
      res.send(result)
    })

    app.get('/patient_appointment', async (req, res) => {
      let query = {}
      if (req.query?.email && req.query.appointment_date) {
        query = { doctor_email: req.query.email, appointment_date: req.query.appointment_date }
      }
      console.log(query)
      let result = await patientAppointment.find(query).toArray()
      // console.log(result)
      res.send(result)
    })

    app.get('/patient_appointment_user', async (req, res) => {
      let query = {}
      if (req.query?.email && req.query.appointment_date) {
        query = { user_email: req.query.email, appointment_date: req.query.appointment_date }
      }
      // console.log(query)
      let result = await patientAppointment.find(query).toArray()
      // console.log(result)
      res.send(result)
    })
    app.get('/patient_history', async (req, res) => {
      let query = {}
      if (req.query?.email && req.query.appointment_date) {
        query = { user_email: req.query.email, appointment_date: req.query.appointment_date }
      }
      // console.log(query)
      let result = await patientAppointment.find(query).toArray()
      // console.log(result)
      res.send(result)
    })
    app.post("/prescription_collection", async (req, res) => {
      const data = req.body
      const result = await prescription_collection.insertOne(data)
      res.send(result)
      })

    





    app.post('/patient_appointment', async (req, res) => {
      let data = req?.body;
      // console.log(data)
      const result = await patientAppointment.insertOne(data)

      res.send(result)
    })
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('easymed is running');
})


app.listen(port, () => {
  console.log('port', port)
})