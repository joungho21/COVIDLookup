const conn = new Mongo("localhost:27017");
const db = conn.getDB("NovelCovid");
const collectionCountries  = db.getCollection("Countries");

/**
 * Script:
 * 
 *  1. Adds a 'bio' subfield to countryInfo field and a comment array 
 *     to each document to store biography and comments for countries
 * 
 *  2. Adds a '2dsphere' index and parses each dataset to add a 'loc' field 
 *     to be used by MongoDB to query for geolocation.
 * 
 */

 /**
  * Adds a bio subfield to countryInfo 
  */

  function addBiography() {
      collectionCountries.find().forEach(doc => {
          collectionCountries.update(
              {_id: doc._id},
              {$set: { countryDescrip: " "}}
          )
      })
  }

/**
  * Adds comments array to each doc
  */
  function addComments() {
      collectionCountries.find().forEach(doc => {
          collectionCountries.update(
              {_id: doc._id},
              {$set: { comments: []}}
          )
      })
  }

/**
  * create 2dsphere index
  */

  function create2dsphere() {
      collectionCountries.createIndex({
          loc: "2dsphere"
      });

      printjson(collectionCountries.getIndexes());
  }
 
  //loop through countries data and add the loc field for each doc
  function addLocation(){
      collectionCountries.find().forEach(doc => {
          
        //check if country info has lat and long fields 
        if("countryInfo" in doc) {
            const cntryInfo = doc.countryInfo;
            // console.log(cntryInfo);
            if(("lat" in cntryInfo && cntryInfo.lat !== "") && 
            ("long" in cntryInfo && cntryInfo.long !== "" )) {
                
                //create loc field
                doc.loc = {
                    type: "Point",
                    coordinates : [
                        cntryInfo.long,
                        cntryInfo.lat
                    ]
                }
               
                //delete the old lat and long fields 
                delete doc.countryInfo.lat;
                delete doc.countryInfo.long;

                //save document
                collectionCountries.save(doc);
                // printjson(doc);
            }
        }
      });
  }

  create2dsphere();
  addLocation();
  addBiography();
  addComments();

