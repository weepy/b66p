function getAudioBufferFromFile(file) {
    
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result
            const context = new (window.AudioContext || window.webkitAudioContext)();
            context.decodeAudioData(data, (buffer) => {
                resolve(buffer)
            })
        }
        reader.readAsArrayBuffer(file)
    })
}


function sliceBuffers(buffers, pageSize) {
    const buf = []
    for(var i=0; i<buffers[0].length;i+=pageSize) {
        const b = [
            buffers[0].slice(i, i+pageSize),
            buffers[1].slice(i, i+pageSize)
        ]
        if(b[0].length < pageSize) {
            break
        }
        buf.push(b)
    }
    return buf
}

const worker = new Worker('/ogg/OggEncoderWorker.js')

async function convertBufferToOgg(buffer, options) {
    var buffersList = sliceBuffers([
        buffer.getChannelData(0),
        buffer.getChannelData(1),
    ], 256)

    return convertBuffersListToOgg(buffersList, options)
}


async function convertBuffersListToOgg(buffersList, options={}) {

    options = { sampleRate: 44100, numChannels: 2, quality: 0.5,...options}

      return new Promise((resolve) => {

        worker.onmessage = (event) => resolve(event.data.blob)

        worker.postMessage({ command: 'start', process: 'separate', ...options })

        buffersList.forEach(buffers => worker.postMessage({ command: 'record', buffers }))

        worker.postMessage({ command: 'finish' })

    })  
}

if(window.module) {
    module.exports = {
        convertBufferToOgg,
        getAudioBufferFromFile,
        convertBuffersListToOgg
    }
}