const { connectMongo, find, getImage } = require("../../utils/mongo");
const { ObjectId, connect } = require("mongodb");

module.exports = {
   async getCountries(req, res, next) {
        //get search value from form
        const searchText = req.query.search;

        //build the query
        const regex = new RegExp(`\\b(${searchText})`, "i");
        const query = {
            $or: [
                {"country": regex},
                {"countryInfo.iso2": regex},
                {"countryInfo.iso3": regex}
            ]
        };

        try {
              const docs = await querySearchedDocuments(query);
              res.render('countries/index', {docs: docs});
              return res.status(200).json(doc);
        }catch(e){
            console.log(e);
            return res.status(500).end();
        }
        
    },

    async getCountry(req, res, next){
        //get id
        const id = req.query.id;

        //create query
        const query = {
            _id: new ObjectId(id);
        }

        try {
             //get country doc
             const country = await getDocumentById(query);
             res.render('countries/show', {country: country});
             return res.status(200).json(country);
        }catch(err){
            console.log(err);
            return res.status(500).end();
        }
    }
}

async function querySearchedDocuments(query){
    try {
        // connect to MongoDB
        const db = await connectMongo();

        //get all documents in MongoDB based on the search string
        return await find(db, query)
    }catch(e){
        console.log(e);
        throw new Error(e);
    }
}

async function getDocumentById(query){
    try {   
          // connect to database
          const db = await connectMongo();

          // get document
          let doc = await find(db, query);
          doc = doc[0];

          //get doc image 
          if (doc.gridFSFile !== undefined){
              const image = await getImage(db, doc.gridFSFile);
              doc.image = image !== undefined ? `data:image/png;base64,${image}` : undefined;
              return doc;
          }

          if(doc.countryInfo.flag !== undefined || doc.countryInfo.flag !== null){
              doc.image  = doc.countryInfo.flag;
              return doc;
          }
    }catch(err){
        console.log(err);
        throw new Error(err);
    }
}
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}