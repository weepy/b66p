<script>
export let barWidth = 100
export let trackHeight = 30

	export let trackIndex = 0



	$: style = `top:${trackHeight*(trackIndex+1)}px;
left:0px;
		line-height: ${trackHeight-4}px;
height:${trackHeight-4}px`
		
</script>
<div class="trackHeader" on:click style={style}>
	<span> + New Track</span>
</div>

<style>

	.trackHeader {
		width: 150px;
		position: absolute;
		padding-left:10px;
		border:1px dotted #ccc;
		font-size: 12px;
		color: #aaa;
    border-bottom-right-radius	: 10px;
		border-top-right-radius	: 10px;
		
	}
	
	.trackHeader:hover {
		border-color: #555;
		cursor: pointer;
	}
	
</style>