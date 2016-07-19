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

        <h2>IATI bug dashboard</h2>
        
        This tool shows insights on data bugs in IATI. 

        It can be seen as a small addition to the data quality checks that the <a href="http://dashboard.iatistandard.org/data_quality.html" target="_blank">IATI Dashboard</a> shows.

        <br /><br />

        The <a href="http://validator.iatistandard.org/" target="_blank">IATI Validator</a> (XSD validation) is a good start, and the IATI Dashboard shows the majority of the data bugs, but there's still checks and in-depth information missing. 

        <br /><br />
        Are defaults set when required attributes are ommited? <br />
        Does the transaction -> provider-acivity-id exist? (not implemented yet!) <br />
        Do the recipient country percentages + recipient region percentags add up to 100%? (not implemented yet!) <br />
        Where do the bugs occur in the XML file? <br />

        <br />That kind of information is intended to be shown by this dashboard. At the moment there's no place to fully check validation and that's reflected in the overall data quality.

        <br /><br />
        This tool runs on validation errors raised by the <a href="https://www.oipa.nl" target="_blank">OIPA</a> parser. See the <Link to="/about">about page</Link> for further information on this tool.
        
        
      </div>
    )
  }
}

export default Home;
