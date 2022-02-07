import axios from 'axios'
import BACKEND_URL from './constants'

let http = null
let httpForm = null
let httpPdf = null
export const getAxios = () => {
  if (!http) {
    http = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-type': 'application/json',
      },
    })
  }
  return http
}

export const getAxiosForm = () => {
  if (!httpForm) {
    httpForm = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-type': 'multipart/form',
      },
    })
  }
  return httpForm
}
// export default { getAxios, getAxiosForm }
export const getAxiosPdf = () => {
  if (!httpPdf) {
    httpPdf = axios.create({
      baseURL: BACKEND_URL,
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
  }
  return httpPdf
}
