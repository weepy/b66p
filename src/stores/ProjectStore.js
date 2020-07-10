

import { writable, get} from 'svelte/store'
import { uuid } from '../utils.js'

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
		tracks.push({_id:uuid(5),name:'New Track'})
		this.tracks.set(tracks) 	
	}
	
}



export default ProjectStore