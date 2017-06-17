/** @flow */
import React, { Component } from 'react'
import { Link } from 'react-router'


const ACTIVE = { backgroundColor: '#4D7573' }


class NavBar extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
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
      </div>
    )
  }
}

export default NavBar
