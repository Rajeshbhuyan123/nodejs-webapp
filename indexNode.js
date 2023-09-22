import http from "http";
// import name, { name2, name3 } from "./feature.js";
// import * as myobj from "./feature.js";
import { fun } from "./feature.js";
import fs from "fs";
import path from "path";

// console.log(name, name2, name3);
// console.log(myobj.default,myobj.name2,myobj.name3);
// console.log(fun());

// const home = fs.readFileSync("./index.html")
// console.log(home);

const server = http.createServer((req, res) => {
    console.log(req.method);
  if (req.url === "/About") {
    res.end(`<h1>About page(${fun()})</h1>`);
  } else if (req.url === "/") {
    res.end("<h1>Home page</h1>");
        // res.end(home)
  } else if (req.url === "/Contact") {
    res.end("<h1>Contact page</h1>");
  } else {
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(5000, () => {
  console.log("Server is working");
});
