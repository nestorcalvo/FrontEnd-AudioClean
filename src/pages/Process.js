// import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Spinner } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import Message from '../components/Message/Message'
import Visualization from '../components/Visualization/Visualization'
import { getAxiosPdf } from '../http-common'

const Process = () => {
  const location = useLocation()
  const [AudiosRetrived, setAudiosRetrived] = useState()
  const [Loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function callApi() {
      const axios = getAxiosPdf()
      try {
        const data = await axios
          .get('/app/process', {
            params: {
              token: localStorage.getItem('token'),
              audio_name: localStorage.getItem('file'),
            },
          })
          .then((res) => {
            setAudiosRetrived(res.data)
            console.log(res.data)
          })
        setLoading(true)
      } catch (err) {
        console.log('Error', err)
        if (err.response === undefined) {
          setMessage('Server out of service, try later')
        } else if (err.response.status === 500) {
          setLoading(true)
          setMessage('Error with the server')
        } else {
          setMessage(err.response.data)
        }
      }
    }
    callApi()
  }, [])
  return (
    <>
      <div className='d-flex justify-content-center'>
        {message ? <Message msg={message} /> : null}
        {Loading ? (
          <Visualization
            token={localStorage.getItem('token')}
            audioName={localStorage.getItem('file')}
            response={AudiosRetrived}
          />
        ) : (
          <Spinner animation='border' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </Spinner>
        )}
      </div>
    </>
  )
}

export default Process
