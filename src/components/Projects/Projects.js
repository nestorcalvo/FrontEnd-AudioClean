/* eslint-disable react/jsx-no-bind */
import uniqid from 'uniqid'
import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'
import { input, output } from '../../portfolio'

import ProjectContainer from '../ProjectContainer/ProjectContainer'
import './Projects.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`

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

const Projects = () => {
  if (!input.length) return null
  if (!output.length) return null
  return (
    <div>
      <section id='projects__before' className='section projects'>
        <h2 className='section__title'>Spectrogram comparison</h2>
        <h4 className='section__title' key={uniqid()}>
          Before
        </h4>
        <div className='projects__grid' key={uniqid()}>
          {input.map((e) => (
            // <ProjectContainer key={uniqid()} project={e} />

            <PdfViz file={e.image_src} myKey={uniqid()} />
          ))}
        </div>
      </section>
      <section id='projects__after' className='section projects'>
        <h4 className='section__title'>After</h4>
        <div className='projects__grid' key={uniqid()}>
          {output.map((e) => (
            // <ProjectContainer key={uniqid()} project={e} />
            <PdfViz file={e.image_src} myKey={uniqid()} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Projects
