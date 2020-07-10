
// let projects = []




function socket_routes(io, db) {

  io.on('connection', (socket) => {


    socket.on('project:create', async (projectData, fn) => {
      projectData._id = Math.random().toString(36).slice(2)


      await db.createProject(projectData)
  
      fn(projectData)
    })
  
    socket.on('project:query', async (o, fn) => {
      
      const docs = await db.queryProjects(o)
      
      fn(docs)
    })
     
    socket.on('project:update', async (pid, o, fn) => {
      const ok =await db.updateProject(pid, o)
      fn && fn( ok ) 
    })
  
    socket.on('project:get', async (pid, fn) => {
      const doc = await db.getProject(pid)
      
      
      fn && fn(doc)
    })
  
    socket.on('project:delete', async (pid, fn) => {
      const ok = await db.deleteProject(pid)
      fn && fn( ok ) 
    })
  
  
    socket.on('project:join', async (pid) => {
      socket.join(pid)
    })
  
    socket.on('project:leave', async (pid) => {
      socket.leave(pid)
    })
    
    
    //////////////
    // 
      
    socket.on('project:action', async (pid, action, arg, fn) => {

      if( action == 'createClip') {
        // run action
      
          const res = await db.createClip(pid, arg)
          if(res)
            io.in(pid).emit('project:action', action, arg)
        
      }
      else if(action == 'updateClip') {
  
        const res = await db.updateClip(pid, arg)
        if(res) 
          io.in(pid).emit('project:action', action, arg)
  
      
      }
      else if(action == 'deleteClip') {
        
  
        const res = await db.deleteClip(pid, arg)
      
        if(res) 
          io.in(pid).emit('project:action', action, arg)
    
      }
  
      if(fn)
        fn(true)
    })

    
    /////// PING
    socket.on("_ping", (sentAt, fn) => {
      fn(sentAt, Date.now())
    })

    socket.on("laggy_jittery_ping", (sentAt, fn) => {
      fn(sentAt, Date.now() + 10*1000 + Math.random()*100)
    })
  })
  

}


module.exports = socket_routes
