/** @flow */
import React, { Component } from 'react'
import { Link } from 'react-router'


class Home extends Component {

  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className="about-page">

        <h2>IATI Bug Tracker</h2>
        
        This tool shows insights on data bugs in all IATI datasets published through the IATI Registry. 
        <br /><br />
        The current <a href="http://validator.iatistandard.org/" target="_blank">IATI Validator</a> (XSD validation) is a great start, 
        and the <a href="http://dashboard.iatistandard.org/data_quality.html" target="_blank">IATI Dashboard</a> shows the majority of the data bugs, but there's still checks missing. 
        <br /><br />
        This tool is an effort to expose those <Link to="/implemented-bugs">missing IATI validation checks</Link> and to provide more in-depth info on where these errors occur. At the moment there's no place to fully check validation and that probably hurts the overall data quality. 

        <br /><br />
        This tool runs on validation errors raised by the <a href="https://www.oipa.nl" target="_blank">OIPA</a> parser. 
        The <Link to="/about">about page</Link> provides further information on this tool. Check out the bugs found in your datasets through the <Link to="/datasets">datasets page</Link>!
        
        <br /><br />
        <br /><br />
        <strong>Note</strong>: The IATI Tech Team is working on a new validator that should also cover all validation errors and will have more functionality than this tool. 
        Progress on it can be followed <a target="_blank" href="http://discuss.iatistandard.org/t/work-towards-an-improved-iati-validator/524/1">here</a>.
        At the time of creating this tool, the plans on the new validator were not public yet.
      </div>
    )
  }
}

export default Home;
