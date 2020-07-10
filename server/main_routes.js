// const cors = require('cors')
const path = require('path')
const mkdirp = require('mkdirp')
const fileUpload = require('express-fileupload')



function main_routes(app) {
  


  app.use(fileUpload({
    // useTempFiles : true,
    // tempFileDir : '/tmp/'
  }))


  // app.use(cors())
  
  const ROOT = path.resolve(`${__dirname}/../`)

  


  app.post('/upload', function(req, res) {
    
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.')
    }

    const { filename } = req.body
    const audioFile = req.files.audioFile
    // const fileStem = uuid(6)
    // const filename = `/${pid}/${fileStem}.${ext}`
    const uploadFilename = ROOT+`/uploads/${filename}`
    
    const uploadFolder = path.dirname(uploadFilename)
    mkdirp.sync(uploadFolder)    

    audioFile.mv( uploadFilename, function(err) {
      if (err) {
        console.log({err})
        return res.status(500).send(err)
      }

      res.send({ filename })
    })
  })
  
  app.get('*', function(req, res, next) {
    res.sendFile(ROOT+'/public/index.html')
  })

  
}


module.exports = main_routes