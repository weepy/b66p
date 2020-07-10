import { writable } from 'svelte/store'

class UIStore {

    
    load(data) {
        this.barWidth = writable(100)
        this.trackHeight = writable(30)
        this.selectedTrackId = writable("d")
        this.recordingClipId = writable("c")
        
        this.selectedClipIds = writable(["asd"])
    }
}


export default UIStore