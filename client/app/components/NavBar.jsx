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
    alert('not implemented yet, high on the to do list!')
    // this.props.enableFullscreen()
  }

  render () {
    return (
      <div className="navbar">
        <Link className="nav-home" to="/">IATI bugs</Link>
        <Link to="/publishers">Bugs by publisher</Link>
        <Link to="/datasets">Bugs by dataset</Link>
        <Link to="/common-errors">Common bugs</Link>
        <Link to="/implemented-bugs">Implemented checks</Link>
        <Link to="/about">About</Link>
        {/*}
        <button id="full-screen-button" onClick={this.enableFullscreen}>Full screen list mode</button>
        {*/}
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
