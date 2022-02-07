import React from 'react'
import PropTypes, { number } from 'prop-types'
import Slider, { Range } from 'rc-slider'

const RangeBar = ({ count, start, end }) => (
  <Range count={count} defaultValue={[start, end]} />
)

RangeBar.propTypes = {
  count: PropTypes.number.isRequired,
  start: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
}

export default RangeBar
