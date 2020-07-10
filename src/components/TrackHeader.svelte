<script>

	export let trackHeight = 30
	
	export let trackIndex
	export let name
	export let selected


	const style = `top:${trackHeight*(trackIndex+1)}px;
left:0px;
		line-height: ${trackHeight-4}px;
height:${trackHeight-4}px`
		
</script>
<div class="trackHeader" on:click class:selected style={style}>
	<input value={name} />
</div>

<style>

	.trackHeader {
		width: 150px;
		position: absolute;
		padding-left:10px;
		border:1px solid #aaa;
		font-size: 12px;
		border-bottom-right-radius	: 10px;
		border-top-right-radius	: 10px;
		color: #aaa;
	}
	
	input {
		width: 70px;
		border:0;
		padding: 2px;
		pointer-events:none;
			color: #aaa;
	}
	
	.selected input {
				pointer-events:all;
		color: black;
	}
	
	.selected {
		font-weight: bold;
		border-color: black;
		color: black;
	}
</style>