import React, { useState } from 'react'
import { Button } from '@material-ui/core'

import { PlayCircleFilledRounded } from '@material-ui/icons'

import Regions from '../components/Regions/Regions'

import 'rc-slider/assets/index.css'
import RangeBar from '../components/RangeBar/RangeBar'

const Parameters = () => {
  const [countIntervals, setCountIntervals] = useState(1)
  return (
    <div className='container mt-4'>
      <Regions />
      <br />
      {/* <RangeBar count={countIntervals} start={0} end={100} /> */}
      {/* <Button endIcon={<PlayCircleFilledRounded />}>H</Button> */}
    </div>
  )
}

export default Parameters
