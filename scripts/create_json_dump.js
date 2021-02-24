const axios = require("axios");
const fs = require("fs");
const { setFlagsFromString } = require("v8");

/**
 * The scritps fetches covid data of all countries from an API 
 * and create a dump json file to be uploaded to MongoDB database
 */

 let json = []; // json array to contain all document ojects from the API 

 const URL = "https://corona.lmao.ninja/v2/countries"; // API url

/**
 * Fetches data from the COVID API url
 */

 async function getData(){
     let count = 0; // to keep track of how many doc objects

     try {

          //make a get request to the API url
          const respObj = await axios.get(URL);
          const data = respObj.data;

          //loop through the data results returned and add each data to the json array
          for(const d of data){
              json.push(d);
              count++;
          }

          //after iterating through all data, write the data to a json file
          if(count === data.length) createJsonDumpData(json);

     } catch(err){
         console.log(err); 
     }
 }

 /**
  * Writes data from the API to a json file
  */
 function createJsonDumpData(json){
     //wirte data to file
     fs.writeFile("covid.json", JSON.stringify(json), err => {
         if(err) console.log(err);
         console.log("covid.json file created!!!!");

         //print file contents
         fs.readFile("covid.json", (err, data) => {
             if(err) console.log(err);
             console.log(JSON.parse(data));
         })
     })
 }

 //invoke getData function
 getData();