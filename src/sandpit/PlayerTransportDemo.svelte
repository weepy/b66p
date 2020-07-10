<script>
import TransportStore from '../stores/TransportStore.js'
import TransportBar from '../components/TransportBar.svelte'
import Transport from '../audio/Transport.js'
import TransportLine from '../components/TransportLine.svelte'


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
    console.log("playerManager ready")
})


const { isPlaying, ftick } = transportStore


// $: console.log($tick)



function click(e) {
    const button = e.srcElement.className.split(" ")[0]

    if(button == "play") {
        transport.play()
    }
    if(button == "rewind") {
        transport.rewind()
    }
    if(button == "stop") {
        transport.stop()
    }
    if(button == "pause") {
        transport.pause()
    }
}
</script>

<div class="window">
<TransportBar on:click={click}  isPlaying={$isPlaying} />
<TransportLine type="position" time={$ftick} />

</div>

<style>
.window {
        width:100%;
        height: 100%;
        /* background: #111; */
}
</style>



