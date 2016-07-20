/** @flow */
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

class NavBar extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  enableFullscreen(){
    this.props.enableFullscreen()
  }

  render () {
    return (
      <div className="navbar">
        <Link className="nav-home" to="/">&#60;iati code="#ERROR" &#47;&#62;</Link>
        <Link to="/publishers">Bugs by publisher</Link>
        <Link to="/datasets">Bugs by dataset</Link>
        <Link to="/common-errors">Common bugs</Link>
        <Link to="/about">About</Link>

        <button id="full-screen-button" onClick={this.enableFullscreen}>Full screen list</button>
      </div>
    )
  }
}

NavBar.propTypes = {
  fullscreen: PropTypes.bool.isRequired
} 

function mapStateToProps(state, props) {
    const { fullscreen } = state

    return {
        fullscreen: fullscreen,
    }
}

import { enableFullscreen } from '../actions/common'
export default connect(mapStateToProps, {
    enableFullscreen,
})(NavBar)
