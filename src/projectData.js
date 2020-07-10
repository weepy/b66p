const projectData = {
    _id:"asdasd",
    bpm:120,

	clips: [{
		_id: "asd",
		trackIndex: 0,
		length: 16,
		time: 32,
		filename: "/audio/"
	},
	{
		_id: "asd",
		trackIndex: 1,
		length: 8,
		time: 32,
		filename: "x"
	},
	{
		_id: "asd",
		trackIndex: 1,
		length: 8,
		time: 32+8,
		filename: "x"
	}, {
		 _id: "new",
		 trackIndex: 3,
		 length: 8,
		 time: 36+8,
		 filename: "x",
		 recording:true
		}],
		
	tracks: [
		{
			_id:"a",
			
			gain: 1,
			pan: 0,
			name:"drums",
			muted: false
		},
		{
			_id:"b",
			
			gain: 1,
			pan: 0,
			name:"drums #2",
			muted: false
		},
		{
			_id:"c",
			
			gain: 1,
			pan: 0,
			name:"bass #2",
			muted: false
		},
		{
			_id:"d",
			
			gain: 1,
			pan: 0,
			name:"bass #2",
			muted: false
		}
	],
	
	transports: [
		{
			loopStart: 32,
			loopEnd: 64,
			position: 52
		}
	]
}

export default projectData