/** @flow */
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
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

Loader.propTypes = {
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

