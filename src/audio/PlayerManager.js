import { get } from 'svelte/store'
import Player from './Player.js'

class PlayerManager {

    constructor(clips, {transport, context, assetManager}) {

        this.clips = clips
        this.players = {}
        this.context = context
        this.transport = transport


        this.assetManager = assetManager

        this.unsubs = []
        
        this.unsubs.push( this.transport.tick.subscribe(() => {
            
            this.scheduleStarts()
        }))

        this.unsubs.push( this.transport.isPlaying.subscribe((playing) => {
            if(playing) {
                this.playOffsetPlayers()
                this.scheduleStarts() // also anthing that's going to start
            }
            else {
                this.stopAll()
            }
        }) )

        this.ready = assetManager.preload(clips.map(c => c.url))
        
    }

    destroy() {
        this.unsubs.forEach(fn => fn())
    }

    getPlayer(clip) {
        let player = this.players[clip._id]
        if(!player) {

            player = new Player(clip, { context: this.context })
            player.output.connect(this.context.destination)

            this.players[clip._id] = player
        }
        
        return player
    }

    scheduleStarts() {
        const ftick = get(this.transport.ftick)
        const tick = Math.floor(ftick) + 1
        const bpm = get(this.transport.bpm)

        const tickSecs = 15/bpm
        const delay = (tick-ftick)*tickSecs
        
        for(let i=0; i<this.clips.length; i++) {
            const clip = this.clips[i]

            if(clip.time == tick) {
                this._startPlayer(clip, delay, bpm)
            }
        }
    }
    
    _startPlayer(clip, delay, bpm){
        const buffer = this.assetManager.getBuffer(clip.url)
        const player = this.getPlayer(clip)
        
        player.start(buffer, delay, bpm)
    }

    playOffsetPlayers() {
        const bpm = get(this.transport.bpm)
        const ftick = get(this.transport.ftick)
        const tickSecs = 15/bpm
        this.clips.forEach(clip => {

            const offset = ftick - clip.time

            if(offset >= 0) {
                if( clip.time + clip.length > ftick) {
                    this._startPlayer(clip, -offset*tickSecs, bpm)
                }
            }
        })

       

    }

    stopAll() {
        Object.values(this.players).forEach(p => p.stop())
    }



}


export default PlayerManager