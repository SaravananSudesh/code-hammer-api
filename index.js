const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.json())
app.use(cors())

//Import routes
const javaCompiler = require('./app/javaCompiler')
const pythonCompiler = require('./app/pythonCompiler')

//Configure routes
app.use('/api/java', javaCompiler)
app.use('/api/python', pythonCompiler)

app.get('/', (req, res) => {
    res.send('Welcome To Code Hammer')
})

const port = 3000
app.listen(port, () => console.log(`Code Hammer API is running at ${port} !`))