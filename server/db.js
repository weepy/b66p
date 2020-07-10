const MongoClient = require('mongodb').MongoClient;

let db
let projectsDb
// Use connect method to connect to the Server
function connect(url, dbName) {

    const client = new MongoClient(url, {useUnifiedTopology: true});

    return new Promise((resolve, reject) => {
        client.connect(function(err) {
            // assert.equal(null, err);
            console.log("Connected successfully to mongo server");
    
            db = client.db(dbName)
            projectsDb = db.collection("projects")
            resolve(db)
        })
    })
}

// function flatten(data, keypath='', ret={}) {
    
//     for(var i in data) {
//         if(data[i]!=null && typeof data[i] == 'object') {
//             flatten(data[i], keypath+i+".", ret)
//         }
//         else {
//             ret[keypath+i] = data[i]
//         }
//     }
//     return ret
// }


function disconnect() {
    client.close();
}

function createProject(projectData) {
    return projectsDb.insertOne(projectData)
}


function getProject(_id) {
    return projectsDb.findOne({_id, deleted: {$ne: true}})
}

function queryProjects(o) {
    return db.collection("projects").find( { deleted: {$ne: true}}).toArray()
}

function deleteProject(_id) {
    
    return projectsDb.updateOne({_id}, {$set:{deleted:true}})
}

function createClip(pid, clipData ) {
    
    return projectsDb.updateOne({_id: pid, "clips.co": { $ne: clipData.co }}, {$push: { clips: clipData }})
}

function deleteClip(pid, _id ) {
    return projectsDb.updateOne({_id: pid}, { $pull: { clips: {_id}} }) 
}

function updateProject(pid, data ) {
    const d = data
    return projectsDb.updateOne({_id: pid}, { $set: d } )  
}

function updateClip(pid, clipData ) {
    const {_id, ...data } = clipData

    const d = {}
    
    for(var i in data) {
        d['clips.$.'+i] = data[i]
    }
    
    return projectsDb.updateOne({_id: pid, "clips._id": _id}, { $set: d } )  
}


module.exports = {
    connect, disconnect, queryProjects, getProject, deleteProject, createClip, createProject, deleteClip, updateClip, updateProject
}
