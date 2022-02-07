import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

import { WaveSurfer, WaveForm } from 'wavesurfer-react'

const AudioReproducer = ({ url, myKey }) => {
  const wavesurferRef = useRef()
  const handleWSMount = useCallback((waveSurfer) => {
    wavesurferRef.current = waveSurfer
    if (wavesurferRef.current) {
      wavesurferRef.current.load(url)

      wavesurferRef.current.on('ready', () => {
        console.log('WaveSurfer is ready')
      })

      wavesurferRef.current.on('loading', (data) => {
        console.log('loading --> ', data)
      })

      if (window) {
        window.surferidze = wavesurferRef.current
      }
    }
  }, [])
  return (
    <div>
      <WaveSurfer
        onMount={handleWSMount}
        height={100}
        pixelRatio={1}
        scrollParent
        normalize
        minimap
      >
        <WaveForm
          // id={myKey}
          // cursorColor='transparent'
          height={80}
          // progressColor='#000000'
          responsive
          // waveColor='#000000'
          barWidth={3}
          cursorWidth={1}
          minimap
        />
      </WaveSurfer>
    </div>
  )
}

AudioReproducer.propTypes = {
  url: PropTypes.string.isRequired,
}

export default AudioReproducer
