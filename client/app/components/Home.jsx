/** @flow */
import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'


class Home extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className="about-page">

        <h2>IATI bugs</h2>
        
        This tool shows insights on data bugs in IATI datasets published through the IATI Registry. 
        <br /><br />
        The <a href="http://validator.iatistandard.org/" target="_blank">IATI Validator</a> (XSD validation) is a good start, 
        and the <a href="http://dashboard.iatistandard.org/data_quality.html" target="_blank">IATI Dashboard</a> shows the majority of the data bugs, but there's still checks missing. 
      
        This tool is an effort to expose those <Link to="/implemented-bugs">missing IATI validation checks</Link> and to provide more in-depth info on where these errors occur.
        <br /><br />

        At the moment there's no place to fully check validation and that probably hurts the overall data quality.

        <br /><br />
        This tool runs on validation errors raised by the <a href="https://www.oipa.nl" target="_blank">OIPA</a> parser. 
        The <Link to="/about">about page</Link> provides further information on this tool. More importantly, check out the bugs found in your datasets through the <Link to="/datasets">datasets page</Link>!
        
      </div>
    )
  }
}

export default Home;
