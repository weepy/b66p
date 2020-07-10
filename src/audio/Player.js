

class Player {
    
    constructor(clip, {context}) {


        this.clip = clip

        this.output = context.createGain()
         
        
        this.context = context
        
    } 
    


 
    start(buffer, delaySecs, bpm) {

        if(this.source) {
            this.stop(delaySecs)
        }
        
        let startOffset = 0
        if(delaySecs < 0) {
            startOffset = -delaySecs
            delaySecs = 0
        }


        const { length, fadeIn=0.005, fadeOut = 0.005, gain = 1, rate = 1} = this.clip

        const tickSecs = 15/bpm
        const durationSecs = length * tickSecs

        const startTime = this.context.currentTime + delaySecs
        const endTime = startTime + durationSecs

        this.output.gain.cancelScheduledValues(startTime)
        this.output.gain.setValueAtTime(0, startTime)
        this.output.gain.linearRampToValueAtTime(gain, startTime + fadeIn)
        this.output.gain.setValueAtTime(gain,endTime -fadeOut||0.005)
        this.output.gain.linearRampToValueAtTime(0.0, endTime)

        const source = this.context.createBufferSource()
        source.buffer = buffer
        source.playbackRate.value = rate
        source.start(startTime, startOffset)
        source.stop(endTime)
        
        
        source.connect(this.output)

        this.source = source
        
    }

    stop(delaySecs=0) {
        
        if(this.source) {

            const oldSource = this.source
            const endTime =  this.context.currentTime + delaySecs + 0.005
            oldSource.stop(endTime)
            
            this.output.gain.cancelScheduledValues(this.context.currentTime )
            this.output.gain.setValueAtTime(this.output.gain.value, endTime - 0.005)
            this.output.gain.linearRampToValueAtTime(0.0, endTime)

            
            setTimeout(() => {
                oldSource.disconnect()
            }, delaySecs*1000+100)
        }
        else {
            // console.log("already stopped")
        }

    }
    
}

export default Player