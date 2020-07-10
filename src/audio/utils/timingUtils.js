

function calcIntervals( peaks, maxTime=1e9 ) {
  const intervals = []

  for(var i=0 ; i<peaks.length;i++) {
      for(var j=i+1 ; j<peaks.length;j++) {

          // if ( j - i > 4) break
          const time = Math.abs(peaks[j].time-peaks[i].time)

          if( time > maxTime ) continue

          intervals.push({
              time,
              power: peaks[j].power*peaks[i].power
          })
      }
  }
  return intervals
}




function tempoScore(tempo, intervals, threshold, multipliers) {
  let ret = 0
  const tickDur = 15/tempo
  
  for(let i=0; i<intervals.length;i++) {
      const interval = intervals[i];
      const ratio = Math.abs(interval.time / tickDur)
      const intervalNum = Math.round(ratio)
      let err = interval.time % tickDur
      
      if(intervalNum > 16) {
        continue
      }
      if(err > tickDur / 2.) {
          err = tickDur-err
      }
      
      const score = 1. - err/(threshold*tickDur)
      
      if(score > 0.) {          
          ret += score * interval.power * (multipliers[intervalNum%16]);
      }
  }

  return ret;
}



function beatScore3(peaks, peak, tempo, intervalTicks) {
  let ret = 0
  const dur = 15/tempo * intervalTicks
  const threshold = (1/intervalTicks)*2

  // const multipliers = {     
  //   0: 4,
  //   4: 2, 
  //   8: 2,
  //   12: 2
  // }

  for(let i=0; i<peaks.length;i++) {

      // if( peaks[i].time > peak.time ) {
      //   continue
      // }

      const interval = Math.abs(peaks[i].time - peak.time)
      const num = interval / dur
      const inum = Math.round(num)
      const err = Math.abs(num - inum)
      const score = 1. - err/threshold
      
      if(score > 0) {          
          ret += score * peaks[i].power
      }
  }

  return ret;
}

function addBeatScores(peaks, tempo, interval) {

  const scores = []
  for(let i=0; i<peaks.length;i++) {
    const peak = peaks[i]

    peak.beatScore = beatScore3(peaks, peak, tempo, interval)
    
  }
  

  
}




function incrementTempoScores(tempos, intervals) {
  const threshold = 0.2

  const multipliers = [
    2.0,1,1,1,
    1.5,1,1,1,
    1.5,1,1,1,
    1.5,1,1,1
  ]

  for(let t = 90; t<=180; t += 1) {

      let score = tempoScore(t, intervals, threshold, multipliers) 

      tempos[t] += score
  }
}


const MaxPeakAge = 5






function getTimingInfo( peaks ) {

  

  const runningTempos = Array(181).fill(0)

  for(let i=0; i<peaks.length;i++) {    
    
    const peak = peaks[i]

    const localPeaks = peaks.filter(p => {
      const age = peak.time - p.time
      return age > 0 && age < MaxPeakAge
    })

    const intervals = calcIntervals(localPeaks)
    incrementTempoScores( runningTempos, intervals )
  }

  const tempos = runningTempos.map((power, tempo) => ({power, tempo})).sort((a,b) => b.power - a.power)

  const tempo = tempos[0] ? tempos[0].tempo : 120


  // const bestBeats = getBeatScores(peaks, tempo, 4).slice(0,10)
  // console.log({bestBeats})
  addBeatScores(peaks, tempo, 16)//.slice(0,10)

  peaks.sort((a,b) => b.beatScore - a.beatScore)
  
  const bestPeak = peaks[0]
  
  peaks.sort((a, b) => a.time - b.time)
  
  const firstPeak = peaks.find(p => {
      const barDur = 240/tempo
      const delta = (bestPeak.time - p.time) / barDur
      const err = Math.abs( Math.round(delta) - delta) 
      // console.log(p)
      if(err < 0.1 && p.power > 0.5*bestPeak.power) {
          return true
      }
  })
  
  const syncPoint = firstPeak.time //% (15/tempo)

  

  /// NOW BEATS
  return {
    tempo,
    // powers, 
    peaks,
    syncPoint
  }

  

}

function getTimingInfoInWorker(samples, callback) {
  
  const run = operative({
    run: function(samples, cb) {
      const info = getTimingInfo(samples)
      cb(info)
    }
  })

  run.run(samples, callback)

}

  module.exports = { getTimingInfo, getTimingInfoInWorker}