/* eslint-disable array-callback-return */
/* eslint-disable react/jsx-no-bind */
import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { v4 as uuidv4 } from 'uuid'
// import axios from 'axios'
import { Card } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

import AudioReproducer from '../AudioReproducer/AudioReproducer'
import { getAxiosForm } from '../../http-common'
import Waveform from '../Waveform/Waveform'
import './Visualization.css'
import BACKEND_URL from '../../constants'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const CardsPdf = (elements, audios) => {
  return (
    <>
      {elements &&
        Object.entries(elements).map(([keys, range], index) => (
          <div key={uuidv4()} className='mt-4'>
            <Card className='vizCardContainer'>
              <Card.Title>{`Region ${index + 1}`}</Card.Title>
              <Card.Body>
                <div className='vizCardBodyContent'>
                  <div>
                    <h4> Original region </h4>
                    <PdfViz file={BACKEND_URL + range[0][0]} myKey={uuidv4()} />
                  </div>
                  <div>
                    <h4> Cleaned region </h4>
                    <PdfViz file={BACKEND_URL + range[1][0]} myKey={uuidv4()} />
                  </div>
                  <div className='vizAudioCard'>
                    {audios && <Waveform url={BACKEND_URL + audios[keys][0]} />}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* <PdfViz file={range[1]} key={uuidv4()} /> */}
          </div>
        ))}
    </>
  )
}
const PdfViz = ({ file, myKey }) => {
  const [numPages, setNumPages] = useState(null)
  function onDocumentLoadSuccess({ nPages }) {
    setNumPages(nPages)
  }
  const renderPdfPreview = (e) => (
    <Document
      key={myKey}
      // className={styles.viewerBlock__pdfContainer__document}
      file={e}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`pdfPage_${index + 1}`}
          pageNumber={index + 1}
          width={250}
          height={400}
          renderTextLayer={false}
        />
      ))}
    </Document>
  )
  return <>{renderPdfPreview(file)}</>
}
const Visualization = ({ token, audioName, response }) => {
  const temp = ''

  const [originalAudio, setpdoriginalAudio] = useState()
  const [denoisedAudio, setdenoisedAudio] = useState()
  const [pdfS, setpdfS] = useState()
  const [elements, setElements] = useState()
  const [audios, setAudios] = useState()
  const [canProcess, setCanProcess] = useState(false)

  let pdfsInput = response.data.map((obj) => obj.pdf_before)
  let pdfsOutput = response.data.map((obj) => obj.pdf_after)

  let denoised = response.data.map((obj) => obj.audio_cleaned)
  let extensions = response.data.map((obj) => obj.extension)
  let tokenArrays = response.data.map((obj) => token)
  let dicFinal = {}
  let arrayTemp = {}
  let history = useHistory()
  const axios = getAxiosForm()
  // console.log('Data:', response.data)
  const audio = `${BACKEND_URL}/app/parameters?token=${localStorage.getItem(
    'token'
  )}&audio_name=${localStorage.getItem('file')}`

  useEffect(() => {
    async function callInfo() {
      const pdfList = [...pdfsInput, ...pdfsOutput]
      const formData = new FormData()
      formData.append('tokens', token)
      formData.append('pdf_names', pdfList)
      const formDataAudios = new FormData()
      formDataAudios.append('tokens', token)
      formDataAudios.append('pdf_names', denoised)

      await axios.post('/app/processPDF', formData).then((res) => {
        setpdfS(res.data)

        response.data.forEach((arr) => {
          dicFinal[arr.token] = [
            Object.values(res.data).filter((element) =>
              element.includes(arr.pdf_before)
            ),
            Object.values(res.data).filter((element) =>
              element.includes(arr.pdf_after)
            ),
          ]
        })
        setElements(dicFinal)
      })

      await axios.post('/app/processPDF', formDataAudios).then((res) => {
        setdenoisedAudio(res.data)
        // console.log('res.data')

        response.data.forEach((arr) => {
          arrayTemp[arr.token] = [res.data[arr.audio_cleaned]]
        })
        // console.log(arrayTemp)
        // setElements((a) => {
        //   return [...a, arrayTemp]
        // })
        setAudios(arrayTemp)
        console.log('Array temp: ', arrayTemp)
        // setpdfBefore(res.data)
      })
    }
    callInfo()
  }, [])

  return (
    <div>
      <div
        style={{ display: !elements ? 'hidden' : 'flex' }}
        className='vizNewAudio'
      >
        {/* <Link to='/' style={{ textDecoration: 'none' }}> */}
        <button
          type='button'
          disabled={canProcess === false}
          onClick={() => {
            history.push({ pathname: '/denoise' })
          }}
        >
          Process new audio{' '}
        </button>
        {/* </Link> */}
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault()
            const formData = new FormData()
            formData.append('tokens', token)
            formData.append('regions', localStorage.getItem('regions'))
            axios
              .post('/app/donwloadZIP', formData, {
                responseType: 'arraybuffer',
              })
              .then((res) => {
                const url = new Blob([res.data], { type: 'application/zip' })
                let csvURL = window.URL.createObjectURL(url)
                let tempLink = document.createElement('a')
                tempLink.href = csvURL
                tempLink.setAttribute('download', `audios_${Date.now()}.zip`)
                tempLink.click()
                console.log(url)
              })
            setCanProcess(true)
          }}
        >
          Download Files{' '}
        </button>
      </div>
      {CardsPdf(elements, audios)}
    </div>
  )
}

export default Visualization
// {pdfBefore &&
//   pdfBefore.map((items) => (
//     <div key={uuidv4()} className='mt-4'>
//       {items}
//       {/* <PdfViz file={items} key={uuidv4()} /> */}
//     </div>
//   ))}

// <CardGroup>
// {pdfS && [
//   Object.values(pdfS).map((items) => (
//     <div key={uuidv4()} className='mt-4'>
//       <Card>
//         <Card.Body>
//           <Card.Title>Card title</Card.Title>
//           <Card.Text>
//             <PdfViz
//               file={`http://localhost:8000${items}`}
//               key={uuidv4()}
//             />
//           </Card.Text>
//         </Card.Body>
//       </Card>
//       ,
//     </div>
//   )),
// ]}
// </CardGroup>
