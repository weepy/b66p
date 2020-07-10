import { writable, get } from 'svelte/store'

class Transport {

    constructor(store, {context}) 
    {

        this.context = context
        this.position = 0
        this.originPosition = 0
        this.bpm = 120
        // this.setTransport(transportData)


        this.store = store
        
        
        this.ftick = store.ftick
        this.tick = store.tick
        this.isPlaying = store.isPlaying

        this.bpm = store.bpm
        this.loopStart = store.loopStart
        this.loopEnd = store.loopEnd



        this.timer = setInterval(() => {
            this.update()
        }, 16)
    } 

    destroy() {
        clearInterval(this.timer)
    }

    update() {

        if(!get(this.isPlaying)) {
            return
        }

        const currentTick = this.measureCurrentTick()


        this.ftick.set(currentTick)

        let nextTick = Math.floor(currentTick)+1
        const lastTick = get(this.tick)

        if(nextTick != lastTick ) {

            const loopEnd = get(this.loopEnd)
            const loopStart = get(this.loopStart)
            const loopLength = loopEnd - loopStart
            if(nextTick == loopEnd && lastTick < nextTick) {
                nextTick -= loopLength
                this.originPosition -= loopLength
                this.ftick.set(currentTick - loopLength)
            }

            this.tick.set(nextTick)
        }

    }

    play() {
        this.originTime = this.context.currentTime
        this.originPosition = get(this.ftick)
        this.isPlaying.set(true)
    }

    measureCurrentTick() {

        if(!get(this.isPlaying)) {
            return this.position
        }
        
        const deltaSecs = this.context.currentTime-this.originTime

        const tickDur = 15/get(this.bpm)

        const deltaTicks = deltaSecs/tickDur

        return this.originPosition + deltaTicks
    }

    pause() {
        const currentTick = this.measureCurrentTick()
        this.ftick.set( currentTick )
        this.originTime = null
        this.isPlaying.set(false)
    }

    rewind(){
        this.originTime = this.context.currentTime
        this.originPosition= 0
        // this.ftick = 0
        this.ftick.set(0)
        this.tick.set(0)
    }
    
    stop() {
        this.pause()
    }

    setLoop(start, end) {

    }


}

export default Transport