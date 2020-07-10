<script>
	export let time
	export let length
	export let trackIndex = 0
	export let recording
	export let selected = false
	
	export let barWidth = 100
	export let trackHeight = 30
	
	$: style = `top:${trackHeight*(trackIndex+1)}px;
left:${barWidth*time/16}px;
width:${barWidth*length/16-1}px;
height:${trackHeight-4}px`
	
</script>
<div class="clip" class:selected class:recording style={style}>
	
</div>
<style>
	.clip {
		background: cyan;
		border: 1px solid black;
		position: absolute;
	}
	.selected {
		box-shadow: 0px 0px 12px 0px black;
	}
	.recording {
		background: rgb(255,40,100);
	}
</style>