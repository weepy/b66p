import { getPowers, getOnsetsSync } from './utils/audioUtils.js'
import { convertBufferToOgg } from './utils/oggUtils.js'
import axios from 'axios'

const AudioContext = window.AudioContext || window.webkitAudioContext



class AssetManager {
    constructor() {
        this.assets = {}
        
    }

    preload(urls) {
        const promises = urls.map(url => this.loadUrl(url))        
        this.ready = Promise.all(promises)
        return this.ready
    }

    getBuffer(url) {

        const asset = this.assets[url]
        if(!asset) return

        // if(withAnalysis && !asset.powers) {
        //     const mono = buffer.getChannelData(0)
        
        //     asset.powers = getPowers(mono)
        //     // asset.onsets = getOnsetsSync(mono)
        // }
        
        return asset.buffer
    }

    async insertLocal(url, buffer) {
        const asset = {
            buffer,
            progress: 0
        }

        this.assets[url] = asset

        const blob = await convertBufferToOgg(buffer)

        const data = new FormData()
        data.append('audioFile', blob, "upload.ogg")
        data.append('filename', url)

        function onUploadProgress( ) {
            asset.progress+=0.01
        }

        asset.upload = axios({ url:'/upload', method:'post', data, onUploadProgress })
            .then(e => {
                delete asset.upload
                return e
            })
            .catch(e => {
                // error = "error: " + e.toString()
                alert(e.toString())
            })

        // return 
        // await uploadOgg( blob, url, (e) => {
        //     console.log(e)
        //     asset.progress+=0.01
        // })
    }

    // getAnalysisForUrl(url) {

    //     let asset = this.assets[url]
    //     if(asset.analysis) return asset.analysis

    //     const buffer = this.assets[url].buffer

    //     const mono = buffer.getChannelData(0)
        
    //     asset.powers = getPowers(mono),
    //     asset.onsets = getOnsetsSync(mono)

   


    //     return asset
    // }

    loadUrl(url) {
        if(this.assets[url]) {
            return Promise.resolve(this.assets[url])
        }

        return fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error("HTTP error, status = " + response.status)
                return response.arrayBuffer()
            })
            .then(data => {
                return new Promise((resolve, reject) => {
                    const context = new AudioContext()
                    context.decodeAudioData(data, buffer => {
                            this.assets[url] = { buffer }
                            resolve(buffer)
                        }, e => {
                            this.assets[url] = { error: e.toString() }
                            reject()   
                        })
                    })
            })   
    }
}

export default AssetManager



function uploadOgg(blob, filename, onUploadProgress=()=>{}) {

	const data = new FormData()
    data.append('audioFile', blob, "upload.ogg")
    data.append('filename', filename)
    

	return axios({ url:'/upload', method:'post', data, onUploadProgress })
	    // .then(e => e.data.filename)
        .catch(e => {
            // error = "error: " + e.toString()
            alert(e.toString())
        })
}