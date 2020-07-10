<script>
export let barWidth = 100
export let trackHeight = 30
	
	
let markers = Array(100).fill(0).map((i,x)=>x)

function style(index) {
	return `left:${index*barWidth}px;width:${barWidth}px;`
}
</script>

<div class="ruler">
	{#each markers as marker, index}
	<div class="marker" style={style(index)}>
		<span>{index}</span>
	</div>
	{/each}

</div>

<style>
.marker {
	position: absolute;
	border-left:1px solid black;
	font-size: 10px;
	height: 100%;
	top:0;
	padding-left: 2px;
	cursor:pointer;
}
	
	.marker:hover {
border-left:3px solid black;
transform:translate(-2px,0px);

	}
	.ruler {
		overflow:hidden;
		position: absolute;
		top: 0;
		left: 0;
		border-bottom: 1px solid black;
		height: 22px;
		width:100%;
		
	}
</style>