import express from 'express';
import { link } from "./modules/constants.mjs"
import routes from "./router/index.mjs";
const app = express();
app.use(routes);
app.listen(link.port, link.hostname, () => {
    console.log(`Server running at http://${link.hostname}:${link.port}/`);
});





