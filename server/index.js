require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const userRoute = require("./Routes/userRoute")
const chatRoute = require("./Routes/chatRoute")


const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/users', userRoute)
app.use('/api/chats', chatRoute)

app.get('/', (req, res) => {
    return res.send("Welcome our chat app APIs...")
})

const port = process.env.PORT || 5000
const uri = process.env.ATLAS_URL


app.listen(port, (req, res) => {
    console.log(`Máy chủ đang hoạt động...`)
    console.log(`http://localhost:${port}`)
})

mongoose.connect(uri)
    .then(() => console.log('Kết nối MongoDB thành công!'))
    .catch((error) => console.log('Kết nối MongoDB thất bại!', error.message))