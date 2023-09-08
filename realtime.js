import protobuf from 'protobufjs';
import express from 'express';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



const schema = "gtfs-realtime.proto"
const data_url = "https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_NagaiTransportation_AllLines_vehicle"


const app = express();
const port = 3001;

app.use(express.json());

app.post('/data', async (req, res) => {
    const url = req.body.url;
    console.log(url);
    if(url == undefined){
        res.send("error")
        return;
    }
    try {
        const root = protobuf.loadSync(schema)
        const FeedMessage = root.lookupType("transit_realtime.FeedMessage");
        const f = await (await fetch(url)).arrayBuffer()
        const message = FeedMessage.decode(new Uint8Array(f)).toJSON();
        res.send(message)
    } catch (error) {
        console.log(error)
        res.send(error.toString())
    }
    
})

//return html
app.get("/data", (req, res) => {
    res.sendFile("./index.html", {root: __dirname})
})

//run server
app.listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`)
    }
)
