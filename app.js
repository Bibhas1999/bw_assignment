import express from "express";
import routes from "./routes/routes.js"
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from "body-parser";
dotenv.config();
const app = new express();

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server is running at port ${process.env.SERVER_PORT}`);
});

app.use(cors({origin:"http://localhost:3000"}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded())
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
app.use('/',routes);