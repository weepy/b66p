<script>
	import { uiStore, projectStore } from '../stores/rootStore.js'
	const { recordingClipId } = uiStore
	const { bpm } = projectStore

	export let isPlaying

	$: console.log("isPlaying", isPlaying)
	$: recording = !!$recordingClipId

	
</script>

<div on:click class="transportBar">
<button class="record" class:recording >●</button>



{#if !isPlaying} 
	<button class="rewind">◀◀</button>
	<button class="play">▶</button>
{:else}
	<button class="stop">◼</button>
	<button class="pause">❚❚</button>
{/if}



<button class="metronome">⧗</button>
<span>{$bpm}</span>

		
</div>


<style>
	.transportBar {
		position: absolute;
		bottom: 0;
		left: 0;
	}
	
	button {
		width: 50px;
		height: 30px;
	}
	.recording { 
	  color: red;
		background: pink;
	}
</style>