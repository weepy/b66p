<script>
import Clip from '../components/Clip.svelte'


import TransportLine from '../components/TransportLine.svelte'	
import TrackHeader from '../components/TrackHeader.svelte'

import TransportBar from '../components/TransportBar.svelte'
import NewTrackHeader from '../components/NewTrackHeader.svelte'
import TimeRuler from '../components/TimeRuler.svelte'


import { projectStore, uiStore } from '../stores/rootStore.js'

const { selectedTrackId } = uiStore


export let params


projectStore.load(params.projectData)

const { clips, tracks, transports } = projectStore

</script>

<TimeRuler />
<div class="arrangement">
{#each $clips as clip}
<Clip recording={clip.recording} trackIndex={clip.trackIndex} time={clip.time} length={clip.length} />
{/each}

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


<TransportLine type="left" time={$transports[0].loopStart} />
<TransportLine type="right" time={$transports[0].loopEnd} />
<TransportLine type="position" time={$transports[0].position} />


<TransportBar />
<style>


</style>