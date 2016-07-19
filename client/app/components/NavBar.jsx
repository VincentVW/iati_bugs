/** @flow */
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'


class NavBar extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className="navbar">
        <Link className="nav-home" to="/">&#60;iati code="#ERROR" &#47;&#62;</Link>
        <Link to="/publishers">Bugs by publisher</Link>
        <Link to="/datasets">Bugs by dataset</Link>
        <Link to="/common-errors">Common bugs</Link>
        <Link to="/about">About</Link>
      </div>
    )
  }
}

export default NavBar