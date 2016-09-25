/** @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'


class Loader extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {

    return (
      <div id="loader">

      </div>
    )
  }
}

function mapStateToProps(state, props) {
    const { datasets } = state

    return {
        datasets: datasets,
    }
}

import { fetchDatasets } from '../actions/datasets'
export default connect(mapStateToProps, {
    fetchDatasets,
})(Loader)

