<script>

import TimeRuler from '../components/TimeRuler.svelte'
import TransportBar from '../components/TransportBar.svelte'
import Transport from '../audio/Transport.js'
import TransportLine from '../components/TransportLine.svelte'
import TransportStore from '../stores/TransportStore.js'

const context = new (window.AudioContext||window.webkitAudioContext)()

const transportStore = new TransportStore()

const transport = new Transport(transportStore, {context})

const { tick, isPlaying, ftick, loopStart, loopEnd } = transportStore


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
<TimeRuler />

<TransportBar on:click={click}  isPlaying={$isPlaying} />
<TransportLine type="position" time={$ftick} />


<TransportLine type="left" time={$loopStart} />
<TransportLine type="right" time={$loopEnd} />




</div>

<style>
.window {
        width:100%;
        height: 100%;
        /* background: #111; */
}
</style>