const express = require('express');
const app = express();
require('express-ws')(app)
const cors = require('cors')
const path = require("path");
const axios = require('axios')
const qs = require("querystring");
const fsp = require('fs/promises')

let client
let count
const baseURL = 'https://www.wjx.cn/wjx/join/savereport.aspx'

app.use(cors())
app.use(express.json())

app.post('/download', async (req, res) => {
    const {params, savePath} = req.body
    console.log(params, savePath)
    count = 0
    for (let i = 0; i < params.length; i++) {
        await wait(500 + Math.random() * 1500)
        const param = params[i]
        const saveFilePath = path.resolve(savePath, `${param.rn}.docx`)
        console.log(qs.stringify(param))
        await download(param, saveFilePath)
        count++
        client.send(count)
    }
    res.send('ok')
})

app.ws('/progress', (ws, req) => {
    client = ws
})

app.listen(8996, () => {
    console.log('start: http://127.0.0.1:8996')
})

function wait(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

async function download(param, savePath) {
    const res = await axios.post(`${baseURL}?${qs.stringify(param)}`, null, {responseType: 'arraybuffer'})
    await fsp.writeFile(savePath, res.data)
}