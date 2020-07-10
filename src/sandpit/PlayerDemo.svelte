<script>

import TransportStore from '../stores/TransportStore.js'
import Transport from '../audio/Transport.js'
import PlayerManager from '../audio/PlayerManager.js'
import AssetManager from '../audio/AssetManager.js'
import projectData from './demoProjectData.js'


const context = new (window.AudioContext||window.webkitAudioContext)()

const assetManager = new AssetManager()

const transportData = {
    bpm: projectData.bpm,
    loopStart: projectData.transports[0].loopStart,
    loopEnd: projectData.transports[0].loopEnd,
}
const transportStore = new TransportStore(transportData)

const transport = new Transport(transportStore, {context})

const playerManager = new PlayerManager(projectData.clips, { transport, context, assetManager})

playerManager.ready.then(() => {
    transport.play()
})


</script>



<style>

</style>