// import greenlet from 'greenlet'



function getOnsetTimes_(mono,threshold=0.5, CHUNK=512) {
    const onsetdetector = new MMLLOnsetDetector(44100)
    onsetdetector.threshold = threshold
    const onsets = []
    
    for(let i=0; i<mono.length-CHUNK+1; i+= CHUNK) {
        const data = mono.slice(i,i+CHUNK)
        const detection = onsetdetector.next(data)
        if(detection) {
            const time = (i-2400)
            onsets.push(time < 0 ? 0 : time)
        }
    }

    return onsets
}

export function getOnsetTimesSync( mono ) {

    const onsets = getOnsetTimes_(mono)

    const improvedOnsets = onsets.map(t => improveSlicePos(t, mono, 1024,256,32))   

    // return onsets

    return improvedOnsets

}

export function getOnsetsSync(mono) {
    const onsets = getOnsetTimesSync(mono)

    return onsets.map(sample => {
        return [sample, rmsBuffer(mono, sample, 1024, 4)]
    })
}

export async function getOnsets( mono ) {
    return new Promise((resolve) => {
        
        resolve(getOnsetsSync(mono))
    })
}

export function warp(buffer, onsets, destination, fadeout) {
    const len = destination[destination.length - 1]

    const output = new AudioBuffer({numberOfChannels:2, length: len, sampleRate:44100})

    const dest = [output.getChannelData(0), output.getChannelData(1)]
    const src = [buffer.getChannelData(0), buffer.getChannelData(buffer.numberOfChannels-1)]

    const fade = 32
    const fade2 = 256

    for(var i=1;i<onsets.length;i++) {
        const start = onsets[i-1]
        const end = onsets[i]
        const length = end - start
        

        const start_dest = destination[i-1]
        const end_dest = destination[i]
        const length_dest = end_dest-start_dest
        
        const ratio = length_dest / length

        const offset = start_dest

        if(ratio <= 1 ) {
            for(let j=0; j<length;j++) {
                const gain = j < fade ? (j/fade) : (length - j) < fade2 ? ((length-j)/fade2) : 1
                dest[0][j+offset] = src[0][j+start] * gain  
                dest[1][j+offset] = src[1][j+start] * gain         
            }
        }
        else {
            const head = Math.floor(length*0.2)
            
            for(let j=0; j<head;j++) {
                const gain = j < fade ? (j/fade) : 1
                dest[0][j+offset] = src[0][j+start] * gain  
                dest[1][j+offset] = src[1][j+start] * gain         

            }

            const tail = length - head
            const longtail = Math.floor(length*ratio)-head

            const f = 256
            
            for(let j=0; j<longtail;j++) {
                
                const j2 = j % (tail-f)
                let num = Math.floor(j/(tail-f))

                let gain = (longtail - j) < fade2 ? ((longtail-j)/fade2) : 1
                gain *= Math.pow(1-j/longtail, fadeout)
                
                const odd = num % 2 == 1
                const jx = odd ? tail - j2 : j2
                

                let d0 = src[0][jx+head+start]
                let d1 = src[1][jx+head+start]
                
                if( num > 0 &&  j2 < f ) {
                    const x = j2/f
                    const jy = odd ? j2 + tail - f : f - j2

                    const r0 = src[0][jy+head+start]
                    const r1 = src[1][jy+head+start]

                    d0 = d0*x+r0*(1-x)
                    d1 = d1*x+r1*(1-x)
                }
                
                dest[0][j+offset+head] = d0 * gain
                dest[1][j+offset+head] = d1 * gain
            }

        
        }

    }
    return output
}



export function streeetch2(buffer, onsets, ratio, fadeout) {
    
    const destination = []

    for(var i=0;i<onsets.length;i++) {
        destination[i] = (onsets[i] * ratio)|0
    }

    const output = warp(buffer, onsets, destination, fadeout)

    return output
}

export function streeetch(buffer, onsets, ratio, fadeout) {
    const output = new AudioBuffer({numberOfChannels:2, length: buffer.length*ratio, sampleRate:44100})

    const dest = [output.getChannelData(0), output.getChannelData(1)]
    const src = [buffer.getChannelData(0), buffer.getChannelData(buffer.numberOfChannels-1)]

    const fade = 32
    const fade2 = 256

    for(var i=1;i<onsets.length;i++) {
        const start = onsets[i-1]
        const end = onsets[i]
        const length = end - start
        
        const offset = (start * ratio)|0

        if(ratio <= 1 ) {
            for(let j=0; j<length;j++) {
                const gain = j < fade ? (j/fade) : (length - j) < fade2 ? ((length-j)/fade2) : 1
                dest[0][j+offset] = src[0][j+start] * gain  
                dest[1][j+offset] = src[1][j+start] * gain         
            }
        }
        else {
            const head = Math.floor(length*0.2)
            
            for(let j=0; j<head;j++) {
                const gain = j < fade ? (j/fade) : 1
                dest[0][j+offset] = src[0][j+start] * gain  
                dest[1][j+offset] = src[1][j+start] * gain         

            }

            const tail = length - head
            const longtail = Math.floor(length*ratio)-head

            const f = 256
            
            for(let j=0; j<longtail;j++) {
                
                const j2 = j % (tail-f)
                let num = Math.floor(j/(tail-f))

                let gain = (longtail - j) < fade2 ? ((longtail-j)/fade2) : 1
                gain *= Math.pow(1-j/longtail, fadeout)
                
                const odd = num % 2 == 1
                const jx = odd ? tail - j2 : j2
                

                let d0 = src[0][jx+head+start]
                let d1 = src[1][jx+head+start]
                
                if( num > 0 &&  j2 < f ) {
                    const x = j2/f
                    const jy = odd ? j2 + tail - f : f - j2

                    const r0 = src[0][jy+head+start]
                    const r1 = src[1][jy+head+start]

                    d0 = d0*x+r0*(1-x)
                    d1 = d1*x+r1*(1-x)
                }
                
                dest[0][j+offset+head] = d0 * gain
                dest[1][j+offset+head] = d1 * gain
            }

        
        }

    }
    return output
}

export function rmsBuffer(data, offset, len, stride=1) {
    let denom = Math.floor(len)/stride
    let sum = 0
    
    for(let i=0; i<len;i+=stride) {
        let x = data[i+offset]
        sum += x*x
    }
    
    return Math.sqrt(sum/denom)
}
export function dB(level) {
    return Math.max(0,100 + Math.log(level)*20)
}


export function drawPowers(canvas, powers, onsets ) {
    

    const H = 140
    canvas.width = powers.length
    canvas.height = H
    const ctx = canvas.getContext('2d')
    
    for(var i=0;i<powers.length; i++) {
        const power = powers[i]

        
        ctx.beginPath()
        ctx.moveTo(i,H)
        


        ctx.lineTo(i, H-power*500)    

        ctx.strokeStyle = "black" 
        ctx.stroke()

    }


    for(var i=0;i<onsets.length; i++) {
        
        const [time, power] = onsets[i]

        
        ctx.beginPath()
        ctx.moveTo(time/256,H)
        


        ctx.lineTo(time/256, H-H*power*5)    

        ctx.strokeStyle = "rgba(255,0,0,1)" 
        ctx.lineWidth = powers.length/100
        ctx.stroke()

    }


    return canvas
}

export function getPowers(data, chunksize = 256, stride=16) {
    const powers = []
    let i
    for(i=0; i<data.length-chunksize;i+=chunksize) {
        powers.push(rmsBuffer(data, i, chunksize, stride))
    }
    if(i < data.length) {
        powers.push(rmsBuffer(data, i, data.length-i, stride))
    }
    
    return powers
}   
 
export function improveSlicePos( pos, data, search, chunk, stride ) {
    

    let best = { time: pos, power: 0}
    const lo = Math.max(search, pos-search)
    const hi = Math.min(data.length-search, pos+search)


    
    for(var i=lo;i<hi;i+=stride) {
        
        
        let prev = rmsBuffer( data, i - search, chunk, 2)
        let next = rmsBuffer( data, i, chunk, 2)

        // if(next - prev < 0.01) {
        //     prev = next
        //     continue
        // }
        
        let power = next/(prev+0.01)
        // if(i<10000)console.log(i, power, next, prev, lo, hi , chunk)
        if(power > best.power) {
            best.power = power
            best.time = i
        }
        // prev = next
    }

    return best.time
}


export function drawPowerTex(data, WIDTH) {
    const powers = getPowers(data, Math.floor(data.length/WIDTH),1)

    const canvas = document.createElement('canvas')
    
    const HEIGHT = 1
    
    canvas.width = WIDTH
    canvas.height = HEIGHT
    const ctx = canvas.getContext('2d')
    const canvasData = ctx.getImageData(0, 0, WIDTH, HEIGHT);

    for(var x=1;x<WIDTH; x++) {
        
        const y = 0
        let p = Math.floor(powers[x]*255)*2



        const col = [p,p,p,1]

        ctx.fillStyle = "rgba("  + col.join(",") + ")"
        ctx.fillRect(x, y, 1,1)
        // var index = (x + y * WIDTH) * 4;

        // canvasData.data[index + 0] = powers[x]*255;
        // canvasData.data[index + 1] = 0;
        // canvasData.data[index + 2] = 0;
        // canvasData.data[index + 3] = 1;
    }

    // ctx.putImageData(canvasData, 0, 0);
    return canvas
}

export function fetchBuffer(url) {
    return new Promise(resolve => {
        fetch(url)
            .then((response) => {
                return response.arrayBuffer()
            })
            .then(data => {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                context.decodeAudioData(data, (buffer) => {
                    resolve(buffer)
                })
            })
        })
}


// export const getOnsetTimesGreen = greenlet( async mono => {
//     let onsets = await getOnsetTimes(mono)
//     return profile.name
// })

// export defauult { fetchBuffer, getOnsetTimes, streeetch, getOnsetTimesSync, getOnsetTimes, getOnsetTimesGreen }
