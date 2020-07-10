<script>
export let time
export let type
export let barWidth = 100
export let trackHeight = 30
	
$: style=`left:${barWidth/16*time}px`

let lastTime = 0
let animate = true
$: {
	if(time < lastTime) {
		animate = false
		setTimeout(() => {
			animate = true
		}, 20)
	}
	lastTime = time	
}


const letter = type[0].toUpperCase()

</script>

<div class:animate class="line {type}" style={style}>
	<div class="marker">
		{letter}
	</div>
</div>


<style>
	
.marker {
	background:black;
	position:absolute;
	top:0;
	left:-1px;
	width:15px;
	height:15px;
	color:white;
	line-height:15px;
	text-align:center;
	font-size:10px;
	cursor:pointer;
}
.line {
	position: absolute;
	height:100%;
	border-left:1px dotted #aaa;
	width:1px;
	}
	
	.right .marker {
					left:-14px;

	}

	.position {
		border-left-style:solid;
	}

	.position.animate {
		/* transition: left 0.125s linear; */
	}

</style>