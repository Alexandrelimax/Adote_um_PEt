const express = require('express')
const cors = require('cors')
const app = express()
const { connectDb } = require('./database/connection')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }))
app.use(express.static('public'))

const UsersRoutes = require('./routers/UsersRoutes');
const PetRoutes = require('./routers/PetRoutes')



app.use('/users', UsersRoutes);
app.use('/pets', PetRoutes);

// app.get('/', (req,res)=>{

// })




const startServer = async () => {

    try {
        await connectDb()
        app.listen(5000, () => {
            console.log('Conectado!!!')
        })
    } catch (error) {
        console.error(error);
    }
}
startServer();