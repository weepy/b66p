import { writable } from 'svelte/store'

class TransportStore {

    constructor(data={}) {
        this.load(data)
    }
    
    load({bpm=120, loopStart=0, loopEnd=16, tick=0, ftick=0, isPlaying=false}) {
        this.bpm = writable(bpm)
        this.loopStart = writable(loopStart)
        this.loopEnd = writable(loopEnd)
        this.tick = writable(tick)
        this.ftick = writable(ftick)
        this.isPlaying = writable(isPlaying)
    }
}


export default TransportStore