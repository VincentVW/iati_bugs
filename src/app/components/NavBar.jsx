/** @flow */
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'


const ACTIVE = { backgroundColor: '#4D7573' }


class NavBar extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  enableFullscreen(){
    alert('not implemented yet, on the to do list!')
    // this.props.enableFullscreen()
  }

  render () {
    return (
      <div className="navbar">
        <Link activeStyle={ACTIVE} className="nav-home" to="/">IATI Bug Tracker</Link>
        <Link activeStyle={ACTIVE} to="/publishers">Bugs by publisher</Link>
        <Link activeStyle={ACTIVE} to="/datasets">Bugs by dataset</Link>
        <Link activeStyle={ACTIVE} to="/common-errors">Common bugs</Link>
        <Link activeStyle={ACTIVE} to="/implemented-bugs">Implemented checks</Link>
        <Link activeStyle={ACTIVE} to="/about">About</Link>
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

export default NavBar
