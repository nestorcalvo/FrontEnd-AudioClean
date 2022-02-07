import { Button } from '@material-ui/core'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'

import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { WaveSurfer, WaveForm, Region } from 'wavesurfer-react'
import { v4 as uuidv4 } from 'uuid'
// import "./styles.css";
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min'
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min'
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min'

import { array } from 'prop-types'
import { Link, useHistory } from 'react-router-dom'
// import axios from 'axios'
import Loader from '../Loader/Loader'
import Message from '../Message/Message'
import './Regions.css'
import { getAxios, getAxiosForm } from '../../http-common'
import BACKEND_URL from '../../constants'

const round2D = (num) => Math.round(num * 100) / 100
const Regions = () => {
  let history = useHistory()
  let dataSend = []
  const [timelineVis, setTimelineVis] = useState(true)

  const [audioContext, setAudioContext] = useState(new AudioContext())
  const [start, setStart] = useState(-1)
  const [stop, setStop] = useState(-1)
  const [message, setMessage] = useState('')
  const [CurrentRegionID, setCurrentRegionID] = useState()
  const [SequenceLength, setSequenceLength] = useState()
  const [FrequencyCompresion, setFrequencyCompresion] = useState('linear')
  const [Sr, setSr] = useState(44100)
  const [FftSize, setFftSize] = useState(4096)
  const [FrequencyBins, setFrequencyBins] = useState(256)
  const [WindowType, setWindowType] = useState('hann')
  const [MinFrequencyValue, setMinFrequencyValue] = useState(200)
  const [MaxFrequencyValue, setMaxFrequencyValue] = useState(18000)
  // 'https://www.mfiles.co.uk/mp3-downloads/gs-cd-track2.mp3'
  const url = `${BACKEND_URL}/app/parameters?token=${localStorage.getItem(
    'token'
  )}&audio_name=${localStorage.getItem('file')}`

  // useEffect(() => {
  //   // const audioFirst = await axios.get()
  //   const data = axios.get(
  //     'http://localhost:8000/app/parameters',
  //     {
  //       params: {
  //         token: localStorage.getItem('token'),
  //         audio_name: localStorage.getItem('file'),
  //       },
  //     },
  //     {
  //       headers: {
  //         'Content-Type': 'audio/wav',
  //       },
  //     }
  //   )
  //   console.log(data).then((res) => {
  //     // const url = res.data
  //     url = res.data
  //     console.log(url)
  //     // console.log('Response', res)
  //   })
  // }, [])

  localStorage.setItem(
    'default',
    JSON.stringify({
      SequenceLength,
      FrequencyCompresion,
      Sr,
      FftSize,
      FrequencyBins,
      WindowType,
      MinFrequencyValue,
      MaxFrequencyValue,
    })
  )
  useEffect(() => {
    const regionList = JSON.parse(localStorage.getItem('regions'))
    if (regionList !== null) {
      regionList.forEach((item) => {
        localStorage.removeItem(item)
      })
    }
    localStorage.setItem('regions', JSON.stringify([]))
  }, [])

  const plugins = useMemo(() => {
    return [
      {
        plugin: RegionsPlugin,
        options: { dragSelection: true },
      },
      {
        plugin: TimelinePlugin,
        options: {
          container: '#timeline',
        },
      },
      {
        plugin: MinimapPlugin,
        options: {
          height: 60,
          waveColor: '#ddd',
          progressColor: '#999',
          cursorColor: '#999',
        },
      },
    ].filter(Boolean)
  }, [])

  const toggleTimeline = useCallback(() => {
    setTimelineVis(!timelineVis)
  }, [timelineVis])

  const [regions, setRegions] = useState([
    // {
    //   id: 'region-1',
    //   start: 0.5,
    //   end: 10,
    //   color: 'rgba(0, 0, 0, .5)',
    //   data: {
    //     systemRegionId: 31,
    //   },
    // },
  ])
  const [regionsAdInfo, setRegionsAdInfo] = useState([
    // {
    //   id: 'region-1',
    //   minFreq: 200,
    //  maxFreq:18000,
    //  freqComp:Linear || MEL || MFCC,
    //  windowType:
    // },
  ])

  // use regions ref to pass it inside useCallback
  // so it will use always the most fresh version of regions list
  const regionsRef = useRef(regions)

  useEffect(() => {
    regionsRef.current = regions
    if (regions) {
      let currentRegionsAdInfo = [...regionsAdInfo]
      regions.forEach((region) => {
        if (!currentRegionsAdInfo.some((el) => el.id === region.id)) {
          // Add that item to regionAdInfo
          let item = {
            id: region.id,
            minFreq: 200,
            maxFreq: 18000,
            freqComp: 'linear',
            windowType: 'hann',
          }
          currentRegionsAdInfo.push(item)
        }
      })
      setRegionsAdInfo(currentRegionsAdInfo)
    }
  }, [regions])

  const regionCreatedHandler = useCallback(
    (region) => {
      console.log('region-created --> region:', region)
      console.log(region.data.systemRegionId)
      // if (region.data.systemRegionId) return
      const finalData = [
        ...regionsRef.current,
        { ...region, data: { ...region.data, systemRegionId: -1 } },
      ]
      setRegions([...finalData])
      console.log(finalData)
    },
    [regionsRef]
  )

  const wavesurferRef = useRef()
  const handleWSMount = useCallback(
    (waveSurfer) => {
      wavesurferRef.current = waveSurfer
      if (wavesurferRef.current) {
        wavesurferRef.current.load(url)

        wavesurferRef.current.on('region-created', regionCreatedHandler)

        wavesurferRef.current.on('ready', () => {
          console.log('WaveSurfer is ready')
        })

        wavesurferRef.current.on('region-removed', (region) => {
          console.log('region-removed --> ', region)
        })

        wavesurferRef.current.on('loading', (data) => {
          console.log('loading --> ', data)
        })

        if (window) {
          window.surferidze = wavesurferRef.current
        }
      }
    },
    [regionCreatedHandler]
  )

  // const generateRegion = useCallback(() => {
  //   if (!wavesurferRef.current) return
  //   const minTimestampInSeconds = 0
  //   const maxTimestampInSeconds = wavesurferRef.current.getDuration()
  //   const distance = generateNum(0, 10)
  //   const [min, max] = generateTwoNumsWithDistance(
  //     distance,
  //     minTimestampInSeconds,
  //     maxTimestampInSeconds
  //   )

  //   const r = generateNum(0, 255)
  //   const g = generateNum(0, 255)
  //   const b = generateNum(0, 255)

  //   setRegions([
  //     ...regions,
  //     {
  //       id: `custom-${generateNum(0, 9999)}`,
  //       start: min,
  //       end: max,
  //       color: `rgba(${r}, ${g}, ${b}, 0.5)`,
  //     },
  //   ])
  // }, [regions, wavesurferRef])

  const removeLastRegion = (e) => {
    console.log(e)
    console.log('Callback:', regionsRef.current)

    console.log(CurrentRegionID)

    let nextRegions = regionsRef.current.filter(
      (item) => item.id !== CurrentRegionID
    )

    localStorage.removeItem(CurrentRegionID)

    setStart(-1)
    setStop(-1)

    setRegions(nextRegions)
    // let nextRegions = [...regions]
    // console.log('Last region: ', nextRegions)
    // nextRegions.pop()

    // setRegions(nextRegions)
  }
  const saveRegion = (e) => {
    console.log('Callback:', regionsRef.current)
    console.log(CurrentRegionID)
    const allRegions = wavesurferRef.current.regions.list
    const regionToUpdate = allRegions[CurrentRegionID]
    regionToUpdate.update({ start, end: stop })
    console.log(allRegions)
    // const regionToUpdate = regionsRef.current.filter(
    //   (region) => region.id === CurrentRegionID
    // )[0]
    // regionToUpdate.update({ start, end: stop })
    // Now Update Additional Region Info
    const regionAdInfoToUpdate = regionsAdInfo.filter(
      (reg) => reg.id === regionToUpdate.id
    )[0]
    if (regionAdInfoToUpdate) {
      const currentAdInfo = regionsAdInfo.filter(
        (reg) => reg.id !== regionToUpdate.id
      )
      regionAdInfoToUpdate.minFreq = MinFrequencyValue
      regionAdInfoToUpdate.maxFreq = MaxFrequencyValue
      regionAdInfoToUpdate.freqComp = FrequencyCompresion
      regionAdInfoToUpdate.windowType = WindowType
      setRegionsAdInfo([...currentAdInfo, regionAdInfoToUpdate])
    }
    localStorage.setItem(
      CurrentRegionID,
      JSON.stringify({
        start,
        stop,
        CurrentRegionID,
        SequenceLength,
        FrequencyCompresion,
        Sr,
        FftSize,
        FrequencyBins,
        WindowType,
        MinFrequencyValue,
        MaxFrequencyValue,
      })
    )
    // regionsRef.current.start = start
    // regionsRef.current.stop = stop
    const regionsList = JSON.parse(localStorage.getItem('regions'))

    if (regionsList.includes(CurrentRegionID)) {
      console.log('Existe')
    } else {
      regionsList.push(CurrentRegionID)
    }

    localStorage.setItem('regions', JSON.stringify(regionsList))
    // JSON.stringify(

    // )
    // localStorage.setItem('regions',JSON.stringify(regionsRef.current.map((id)=>{

    // })))
  }
  //   [regions]
  // )

  const play = useCallback(() => {
    wavesurferRef.current.playPause()
  }, [])
  const handleClick = useCallback((e) => {
    console.log(e.id)
    setCurrentRegionID(e.id)
    let newStart = round2D(e.start)
    let newEnd = round2D(e.end)
    setStart(newStart)
    setStop(newEnd)

    const adtRegData = regionsAdInfo.filter((reg) => reg.id === e.id)[0]
    console.log(adtRegData.windowType)
    setFrequencyCompresion(adtRegData.freqComp)
    setMinFrequencyValue(adtRegData.minFreq)
    setMaxFrequencyValue(adtRegData.maxFreq)
    setWindowType(adtRegData.windowType)
    console.log('Clicked')
  })
  const next = async (e) => {
    e.preventDefault()

    regions.forEach((region) => {
      if (localStorage.getItem(region.id)) {
        console.log('Esta en el local storage')
      } else {
        let startTemp = Math.round(region.start * 100) / 100
        let stopTemp = Math.round(region.end * 100) / 100
        console.log(region)
        console.log(region.start)
        let regionTempId = region.id
        let regionsListTemp = JSON.parse(localStorage.getItem('regions'))
        regionsListTemp.push(region.id)
        localStorage.setItem('regions', JSON.stringify(regionsListTemp))
        let defaultValues = JSON.parse(localStorage.getItem('default'))
        localStorage.setItem(
          region.id,
          JSON.stringify({
            start: startTemp,
            stop: stopTemp,
            CurrentRegionID: region.id,
            ...defaultValues,
          })
        )
      }
      dataSend.push(JSON.parse(localStorage.getItem(region.id)))
    })

    const formData = new FormData()
    formData.append('data', JSON.stringify(dataSend))
    formData.append('token', localStorage.getItem('token'))
    formData.append('audio_name', localStorage.getItem('file'))
    console.log(formData)
    const axios = getAxiosForm()
    try {
      const res = await axios.post('/app/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res) {
        history.push({ pathname: '/process', state: { data: res.data } })
      }
    } catch (err) {
      console.log('Error', err)
      if (err.response === undefined) {
        setMessage('Server out of service, try later')
      } else if (err.response.status === 500) {
        setMessage('Error with the server')
      } else {
        setMessage(err.response.data)
      }
    }
  }
  const updateAddInfo = (keyToUpdate, value) => {
    const regionToUpdateIndex = regionsAdInfo.findIndex(
      (reg) => reg.id === CurrentRegionID
    )
    if (regionToUpdateIndex !== -1) {
      const regionsAdInfoCurrent = [...regionsAdInfo]
      const regionToUpdate = regionsAdInfoCurrent[regionToUpdateIndex]
      regionsAdInfoCurrent[regionToUpdateIndex][keyToUpdate] = value
      setRegionsAdInfo(regionsAdInfoCurrent)
    }
  }
  const handleStartValue = (e) => {
    console.log(parseFloat(e.target.value))
    setStart(round2D(e.target.value))
  }
  const handleStopValue = (e) => {
    setStop(round2D(e.target.value))
  }
  const handleMinFrequencyValue = (e) => {
    const minFreqVal = round2D(e.target.value)
    setMinFrequencyValue(minFreqVal)
    updateAddInfo('minFreq', minFreqVal)
  }

  const handleMaxFrequencyValue = (e) => {
    const maxFreqVal = round2D(e.target.value)
    setMaxFrequencyValue(maxFreqVal)
    updateAddInfo('maxFreq', maxFreqVal)
  }
  const handleFrequencyCompresion = (e) => {
    setFrequencyCompresion(e.target.value)
    updateAddInfo('freqComp', e.target.value)
  }
  const handleWindowType = (e) => {
    setWindowType(e.target.value)
    updateAddInfo('windowType', e.target.value)
  }
  const handleRegionUpdate = useCallback((region, smth) => {
    console.log('region-update-end --> region:', region)
    // if (region.data.systemRegionId) return
    // regionsRef.current.pop()
    console.log(regionsRef.current)
    const allRegions = regionsRef.current
    const filteredRegions = allRegions.filter((reg) => reg.id !== region.id)
    regionsRef.current = filteredRegions
    setRegions([
      ...regionsRef.current,
      { ...region, data: { ...region.data, systemRegionId: -1 } },
    ])

    console.log(smth)
  }, [])
  console.log(JSON.parse(localStorage.getItem('regions'))[0])

  return (
    <>
      {message ? <Message msg={message} /> : null}
      <div className='container col'>
        <div className='row justify-content-between'>
          <div className='col-2'>
            <button
              onClick={play}
              type='button'
              className='btn btn-primary w-10 p-3'
            >
              Play / Pause
            </button>
          </div>
          <div className='col-2'>
            {regions[0] && (
              // <Link
              //   to='/'
              //   onClick={next}
              //   type='submit'
              //   className='btn btn-success w-10 p-3'
              // >
              //   Next
              // </Link>

              <button
                onClick={next}
                type='submit'
                className='btn btn-success w-10 p-3'
              >
                Next
              </button>
            )}
          </div>
        </div>
        <br />
        <br />
        <WaveSurfer
          plugins={plugins}
          onMount={handleWSMount}
          height={100}
          pixelRatio={1}
          scrollParent
          normalize
          minimap
        >
          <WaveForm
            id='waveform'
            // cursorColor='transparent'
            height={80}
            // progressColor='#000000'
            responsive
            // waveColor='#000000'
            barWidth={3}
            cursorWidth={1}
            minimap
          >
            {regions.map((regionProps) => (
              <Region
                onUpdateEnd={handleRegionUpdate}
                onClick={handleClick}
                styles={{ zIndex: 5 }}
                key={regionProps.id}
                {...regionProps}
              />
            ))}
          </WaveForm>
        </WaveSurfer>
        <div className='row'>
          <div id='timeline' />
        </div>
        {/* <div className='container'> */}
        {/* <button
          type='button'
          className='btn btn-primary'
          onClick={generateRegion}
        >
          Generate region
        </button> */}

        {/* <button
          type='button'
          className='btn btn-primary w-25 p-3'
          onClick={removeLastRegion}
        >
          Remove last region
        </button> */}
        {/* <button
          type='button'
          className='btn btn-primary'
          onClick={toggleTimeline}
        >
          Toggle timeline
        </button> */}
        {/* </div> */}
        <br />
        {start !== -1 &&
          stop !== -1 && [
            <div className='container'>
              <div className='row'>
                <div className='col-lg-7 mx-auto'>
                  <div className='card mt-2 mx-auto p-4 bg-light'>
                    <div className='card-body bg-light'>
                      <div className='container'>
                        <form id='contact-form'>
                          <div className='controls'>
                            <div className='row'>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <label htmlFor='form_start'>
                                    Start
                                    <input
                                      id='form_start'
                                      type='number'
                                      step='0.01'
                                      name='start'
                                      className='form-control'
                                      onChange={handleStartValue}
                                      value={start}
                                      // placeholder='Please enter your firstname *'
                                      required='required'
                                      data-error='Start value is required.'
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <label htmlFor='form_lastname'>
                                    Stop
                                    <input
                                      id='form_stop'
                                      type='number'
                                      name='stop'
                                      step='0.01'
                                      className='form-control'
                                      onChange={handleStopValue}
                                      value={stop}
                                      // placeholder='Please enter your lastname *'
                                      required='required'
                                      data-error='Stop value is required.'
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <label htmlFor='form_min_freq'>
                                    Minimun Frequency Analysis
                                    <input
                                      id='form_min_freq'
                                      type='number'
                                      name='min_freq'
                                      className='form-control'
                                      onChange={handleMinFrequencyValue}
                                      value={MinFrequencyValue}
                                      // placeholder='Please enter your firstname *'
                                      required='required'
                                      data-error='Minimun Frequency value is required.'
                                    />
                                  </label>
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <label htmlFor='form_max_freq'>
                                    Maximun Frequency Analysis
                                    <input
                                      id='form_max_freq'
                                      type='number'
                                      name='max_freq'
                                      className='form-control'
                                      onChange={handleMaxFrequencyValue}
                                      value={MaxFrequencyValue}
                                      // placeholder='Please enter your firstname *'
                                      required='required'
                                      data-error='Maximun Frequency value is required.'
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <label htmlFor='f_compresion'>
                                    Frequency Compresion
                                    <select
                                      id='form_need'
                                      name='f_compresion'
                                      className='form-control'
                                      required='required'
                                      data-error='Select a Frequency Compressor'
                                      value={FrequencyCompresion}
                                      onChange={handleFrequencyCompresion}
                                    >
                                      <option value='linear'>Linear</option>
                                      <option value='mel'>MEL</option>
                                      <option value='mfcc'>MFCC</option>
                                    </select>
                                  </label>
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <label htmlFor='window'>
                                    Window Type
                                    <select
                                      id='window'
                                      name='window'
                                      className='form-control'
                                      required='required'
                                      data-error='Select a Window Type'
                                      value={WindowType}
                                      onChange={handleWindowType}
                                    >
                                      <option value='hann'>Hann</option>
                                      <option value='blackman'>Blackman</option>
                                      <option value='hamming'>Hamming</option>
                                      <option value='kaiser'>Kaiser</option>
                                    </select>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <br />
                            <div className='row'>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <input
                                    type='button'
                                    className='btn btn-success btn-send pt-2 btn-block'
                                    value='Add/Update region'
                                    onClick={saveRegion}
                                  />
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='form-group'>
                                  <input
                                    className='btn btn-danger btn-send pt-2 btn-block'
                                    value='Delete region'
                                    type='button'
                                    onClick={removeLastRegion}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
          ]}
      </div>
    </>
  )
}

export default Regions
