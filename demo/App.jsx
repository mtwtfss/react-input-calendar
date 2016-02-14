import React from 'react'
import Calendar from '../dist/mtwtfss-calendar'

export default class App extends React.Component {
  render() {
    return (
      <Calendar date={'01-20-2015'} format="MM-DD-YYYY" />
    )
  }
}
