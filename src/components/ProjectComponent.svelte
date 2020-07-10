<script>

import Clip from '../components/Clip.svelte'
import {projectStore, uiStore, transportStore} from '../stores/rootStore.js'




import TransportLine from '../components/TransportLine.svelte'	
import TrackHeader from '../components/TrackHeader.svelte'
import TransportBar from '../components/TransportBar.svelte'
import NewTrackHeader from '../components/NewTrackHeader.svelte'
import TimeRuler from '../components/TimeRuler.svelte'

/// AUDIO
import Transport from '../audio/Transport.js'
import PlayerManager from '../audio/PlayerManager.js'
import AssetManager from '../audio/AssetManager.js'




const context = new (window.AudioContext||window.webkitAudioContext)()


const { clips, title, tracks } = projectStore
const { selectedTrackId } = uiStore

const transport = new Transport(transportStore, {context})

const { tick, isPlaying, ftick, loopStart, loopEnd } = transportStore



const assetManager = new AssetManager()
const playerManager = new PlayerManager($clips, { transport, context, assetManager})
playerManager.ready.then(() => {
    console.log("playerManager ready")
})

$: {
	console.log($tracks.length)
}


function handleTransportClick(e) {

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
<div class="project">
	<div> { $title } </div>


	<div class="tracks">
		{#each $tracks as track, index}
			<TrackHeader 
				selected={track._id == $selectedTrackId}
				name={track.name} 
				trackIndex={index}
				on:click={() => selectedTrackId.set(track._id) } />
		{/each}
			
			
		<NewTrackHeader 
			trackIndex={$tracks.length} 
			on:click={() => projectStore.createNewTrack() }
		/>
	</div>

	<div class="main">
		<TimeRuler />

		<div class="clips">
			{#each $clips as clip}
				<Clip   recording={clip.recording} 
						trackIndex={clip.trackIndex} 
						time={clip.time} 
						length={clip.length} />
			{/each}
		</div>

		<TransportBar on:click={handleTransportClick}  isPlaying={$isPlaying} />
		<TransportLine type="position" time={$ftick} />


		<TransportLine type="left" time={$loopStart} />
		<TransportLine type="right" time={$loopEnd} />
	</div>

</div>

<style>

.main {
	position: absolute;
	top: 0px;
	left: 200px;
	width: calc(100% - 200px);
	height: 100vh;
}

</style>
