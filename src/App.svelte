<script>
import { onMount } from 'svelte'
import io from 'socket.io-client'
import router from "page"

import projectData from './projectData.js'

import ProjectPage from './pages/ProjectPage.svelte'
import HomePage from './pages/HomePage.svelte'
import ErrorPage from './pages/ErrorPage.svelte'

import TransportDemo from './sandpit/TransportDemo.svelte'
import PlayerDemo from './sandpit/PlayerDemo.svelte'
import PlayerTransportDemo from './sandpit/PlayerTransportDemo.svelte'
import SandpitIndex from './sandpit/index.svelte'
import ProjectDemo from './sandpit/ProjectDemo.svelte'


let page
let params 
let socket

// let socket = io({
//   transports: ['websocket']
// })
// socket.on('reconnect_attempt', () => {
//   socket.io.opts.transports = [ 'websocket'];
// })

// function queryProjects(ctx, next) {
//     socket.emit('project:query', {}, (projects) => {
//         params = projects
//         next()
//     })
// }



// router('/sandpit/ripple', () => page = RippleDemo)
// router('/sandpit/stretch', () => page = StreeetchDemo)
// router('/sandpit/wavedrawing', () => page = WaveDrawingDemo)
// router('/sandpit/bpm', () => page = BpmDemo)
// router('/sandpit/quantize', () => page = QuantizeDemo)
// router('/dev', queryProjects, () => page = DevPage)


router('/', () => page = HomePage)
router('/project', (ctx, next) => {
        params = { projectData }
        next()
    }, () => page = ProjectPage)

router('/sandpit', () => page = SandpitIndex)
router('/sandpit/transport', () => page = TransportDemo)
router('/sandpit/player', () => page = PlayerDemo)
router('/sandpit/playerWithTransport', () => page = PlayerTransportDemo)
router('/sandpit/project', () => page = ProjectDemo)

// router('/help', () => page = HelpPage)


// // router('/', () => page = Home)
// router('/p/:id', (ctx, next) => {
//     socket.emit('project:get', ctx.params.id, (project) => {

//         if(project == null) {
//             console.error("no such project")
//             router("/")
//             return
//         }


//         // STORE IN LOCAL STORAGE
//         const projects = JSON.parse(localStorage.projects||"[]")
//         if(projects.find(p => p._id == project._id) == null) {
//             projects.push({title: project.title, _id: project._id})
//         }

//         localStorage.projects = JSON.stringify(projects)


//         params = project
//         next()
//     })
// }, () => page = ProjectPage)


router('*', () => page = ErrorPage)



router.start()


</script>

<svelte:component this={page} params={params} socket={socket} />


 

