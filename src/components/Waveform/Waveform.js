/* eslint-disable jsx-a11y/label-has-associated-control */
// import WaveSurfer from 'wavesurfer.js'
// import React, { useRef, useEffect, useState } from 'react'
// import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min'
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min'
// import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min'
// import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min'

// const Waveform = () => {
//   const waveformRef = useRef()
//   const wavetimeLine = useRef()
//   const url = 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3'
//   const [playing, setPlaying] = useState(false)
//   const [audioContext, setAudioContext] = useState(new AudioContext())
//   const [waveform, setWaveform] = useState(null)
//   const [time, setTime] = useState(0)

//   function togglePlayPause() {
//     if (audioContext.state === 'suspended') {
//       audioContext.resume()
//     }

//     waveform.playPause()
//     setPlaying(!playing)
//   }
//   function randomColor(alpha) {
//     return `rgba(${Math.random() * 255} ,${Math.random() * 255},${
//       Math.random() * 255
//     },${alpha || 1})`
//   }
//   function durationChange(e) {
//     const newTime = parseFloat(e.target.currentTime).toFixed(1)
//     console.log(newTime)
//     setTime(waveform.getCurrentTime())
//   }
//   function saveRegions() {
//     localStorage.regions = JSON.stringify(
//       Object.keys(waveform.regions.list).map((id) => {
//         const region = waveform.regions.list[id]
//         return {
//           start: region.start,
//           end: region.end,
//           attributes: region.attributes,
//           data: region.data,
//         }
//       })
//     )
//   }
//   function loadRegions(regions) {
//     regions.forEach((region) => {
//       const reg = region
//       reg.color = randomColor(0.1)
//       waveform.addRegion(reg)
//     })
//   }
//   function editAnnotation(region) {
//     const form = document.forms.edit
//     form.style.opacity = 1
//     form.elements.start.value = Math.round(region.start * 10) / 10
//     form.elements.end.value = Math.round(region.end * 10) / 10
//     form.elements.note.value = region.data.note || ''
//     form.onsubmit = (e) => {
//       e.preventDefault()
//       region.update({
//         start: form.elements.start.value,
//         end: form.elements.end.value,
//         data: {
//           note: form.elements.note.value,
//         },
//       })
//       form.style.opacity = 0
//     }
//     form.onreset = () => {
//       form.style.opacity = 0
//       form.dataset.region = null
//     }
//     form.dataset.region = region.id
//   }

//   /**
//    * Display annotation.
//    */
//   function showNote(region) {
//     if (!showNote.el) {
//       showNote.el = document.querySelector('#subtitle')
//     }
//     showNote.el.textContent = region.data.note || '–'
//   }
//   useEffect(() => {
//     if (waveformRef.current) {
//       const plugins = [
//         {
//           plugin: RegionsPlugin,
//           options: { dragSelection: true },
//         },
//         {
//           plugin: TimelinePlugin,
//           options: {
//             container: wavetimeLine.current,
//           },
//         },
//         {
//           plugin: MinimapPlugin,
//           options: {
//             height: 30,
//             waveColor: '#ddd',
//             progressColor: '#999',
//             cursorColor: '#999',
//           },
//         },
//       ]
//       const wavesurfer = WaveSurfer.create({
//         container: waveformRef.current,
//         audioContext,
//         backend: 'WebAudio',
//         height: 80,
//         progressColor: '#2D5BFF',
//         responsive: true,
//         waveColor: '#8d99ae',
//         cursorColor: 'transparent',
//         barWidth: 3,
//         cursorWidth: 1,
//         minimap: true,
//         plugins,
//         // backend: 'MediaElement',
//       })
//       wavesurfer.on('finish', togglePlayPause)
//       wavesurfer.load(url)
//       wavesurfer.enableDragSelection({
//         color: randomColor(0.1),
//       })
//       wavesurfer.on('region-click', (region, e) => {
//         e.stopPropagation()
//         // Play on click, loop on shift click
//         if (e.shiftKey) {
//           region.playLoop()
//         } else {
//           region.play()
//         }
//       })
//       wavesurfer.on('region-click', editAnnotation)
//       wavesurfer.on('region-updated', saveRegions)
//       wavesurfer.on('region-removed', saveRegions)
//       wavesurfer.on('region-in', showNote)

//       wavesurfer.on('region-play', (region) => {
//         region.once('out', () => {
//           wavesurfer.play(region.start)
//           wavesurfer.pause()
//         })
//       })

//       //   wavesurfer.on('ready', () => {
//       //     wavesurfer.enableDragSelection({
//       //       color: '#2D5BFF',
//       //     })
//       //   })
//       setWaveform(wavesurfer)
//     }
//   }, [])

//   return (
//     <>
//       <div ref={wavetimeLine} />
//       <div ref={waveformRef}>
//         {/* <Wave id='waveform' /> */}

//         <button
//           type='button'
//           onClick={togglePlayPause}
//           className='container mb-4'
//         >
//           {playing ? 'Pause' : 'Play'}
//         </button>
//         <audio>
//           <track
//             kind='captions'
//             id='track'
//             src={url}
//             onTimeUpdate={durationChange}
//           />
//         </audio>
//         <h4>{time}</h4>
//       </div>
//     </>
//   )
// }

// export default Waveform

import React, { useEffect, useRef, useState } from 'react'
import './WaveForm.css'
import WaveSurfer from 'wavesurfer.js'

const formWaveSurferOptions = (ref) => ({
  container: ref,
  waveColor: '#eee',
  progressColor: 'OrangeRed',
  cursorColor: 'OrangeRed',
  barWidth: 3,
  barRadius: 3,
  responsive: true,
  height: 150,
  // If true, normalize by the maximum peak instead of 1.0.
  normalize: true,
  // Use the PeakCache to improve rendering speed of large waveforms.
  partialRender: true,
})

export default function Waveform({ url }) {
  const waveformRef = useRef(null)
  const wavesurfer = useRef(null)
  const [playing, setPlay] = useState(false)
  const [volume, setVolume] = useState(0.5)

  // create new WaveSurfer instance
  // On component mount and when url changes
  useEffect(() => {
    setPlay(false)

    const options = formWaveSurferOptions(waveformRef.current)
    wavesurfer.current = WaveSurfer.create(options)

    wavesurfer.current.load(url)

    wavesurfer.current.on('ready', () => {
      // https://wavesurfer-js.org/docs/methods.html
      // wavesurfer.current.play();
      // setPlay(true);

      // make sure object stillavailable when file loaded
      if (wavesurfer.current) {
        wavesurfer.current.setVolume(volume)
        setVolume(volume)
      }
    })

    // Removes events, elements and disconnects Web Audio nodes.
    // when component unmount
    return () => wavesurfer.current.destroy()
  }, [url])

  const handlePlayPause = () => {
    setPlay(!playing)
    wavesurfer.current.playPause()
  }

  const onVolumeChange = (e) => {
    const { target } = e
    const newVolume = +target.value

    if (newVolume) {
      setVolume(newVolume)
      wavesurfer.current.setVolume(newVolume || 1)
    }
  }

  return (
    <div>
      <div ref={waveformRef} className='vizWaveForm' />
      <div className='controls'>
        <div>
          <button type='button' onClick={handlePlayPause}>
            {!playing ? 'Play' : 'Pause'}
          </button>
        </div>
        <div>
          <input
            type='range'
            id='volume'
            name='volume'
            // waveSurfer recognize value of `0` same as `1`
            //  so we need to set some zero-ish value for silence
            min='0.01'
            max='1'
            step='.025'
            onChange={onVolumeChange}
            defaultValue={volume}
          />
          <label htmlFor='volume'>Volume</label>
        </div>
      </div>
    </div>
  )
}
