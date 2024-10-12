import express from 'express'
import ngrok from 'ngrok'
const app = express()
const port = 3000

app.get('/', (req, res)=>{
    res.type('html')
    res.send('<h1>Hello World</h1>')
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
    ngrok.connect(port).then(ngrokURL => {
        console.log('ngrokURL');
    }).catch(console.log("can;t"))
})