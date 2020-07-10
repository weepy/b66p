

import { writable, get} from 'svelte/store'

class ProjectStore {
	
	load(projectData) {
		this.bpm = writable(projectData.bpm)
		this.title = writable(projectData.title)
		this.clips = writable(projectData.clips)
		this.tracks = writable(projectData.tracks)	
		
		

		this.transports = writable(projectData.transports)
	}
	
	createNewTrack() {
		const tracks = get(this.tracks)
		tracks.push({_id:'xx',name:'# Track'})
		this.tracks.set(tracks) 	
	}
	
}



export default ProjectStore