// import axios from 'axios'
import React, { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { getAxiosForm } from '../../http-common'
import Message from '../Message/Message'
import ProgressBar from '../ProgressBar/ProgressBar'

const AudioUploader = () => {
  const [files, setFiles] = useState('')
  const [token, setToken] = useState('')
  //   const [filesname, setFilesname] = useState([''])
  const [uploadedFile, setUploadedFile] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadPorcentage, setUploadPorcentage] = useState(0)
  useEffect(() => {
    // storing input name
    if (localStorage.getItem('token', uuidv4()) == null) {
      localStorage.setItem('token', uuidv4())
    }
    setToken(localStorage.getItem('token', uuidv4()))
    const regionList = JSON.parse(localStorage.getItem('regions'))
    if (regionList !== null) {
      regionList.forEach((item) => {
        localStorage.removeItem(item)
      })
    }

    localStorage.setItem('regions', JSON.stringify([]))
  }, [])
  useEffect(() => {
    let filename
    try {
      filename = files.name
    } catch {
      filename = ''
    }
    localStorage.setItem('file', filename)
  }, [files])
  const onChange = (e) => {
    const arrayFiles = e.target.files
    setUploadPorcentage(0)
    setFiles(arrayFiles[0])
    console.log(arrayFiles)
  }
  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('file', files)

    formData.append('path', token)
    console.log(files)
    console.log(token)
    console.log(formData)
    const axios = getAxiosForm()
    try {
      const res = await axios.post('/app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (files) {
            setUploadPorcentage(
              parseInt(
                Math.round((progressEvent.loaded * 100) / progressEvent.total),
                10
              )
            )
          }
          // setTimeout(() => {
          //   setUploadPorcentage(0)
          // }, 10000)
        },
      })
      //   const { name } = res.data
      setUploadedFile(true)
      console.log(uploadedFile)
      setMessage('File Uploaded')
    } catch (err) {
      if (err.response === undefined) {
        setMessage('Server out of service, try later')
      } else if (err.response.status === 500) {
        setMessage('Error with the server')
      } else {
        setMessage(err.response.data)
      }
    }
  }

  return (
    <>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            className='form-control custom-file-input'
            type='file'
            id='custom-file'
            accept='.wav'
            onChange={onChange}
          />
          <br />
          {files && (
            <li key={files.name} className='list-group'>
              <span className='list-group-item'>Name: {files.name}</span>
            </li>
          )}
          {/* {Object.values(files).map((value, i) => (
            
          ))} */}
        </div>
        <ProgressBar percentage={uploadPorcentage} />
        <br />
        <div className='row justify-content-between'>
          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-block col-4'
          />
          {uploadedFile ? (
            <Link
              to='/parameters'
              className='btn btn-outline-success btn-block col-4'
              style={{ textDecoration: 'none' }}
            >
              Next
            </Link>
          ) : null}
        </div>
      </form>
      {/* {uploadedFile ? <Link></Link>} */}
    </>
  )
}

export default AudioUploader
