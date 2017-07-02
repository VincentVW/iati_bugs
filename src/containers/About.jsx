/** @flow */
import React, { Component } from 'react'
import { connect } from 'react-redux'



import { setPageTitle } from '../actions/header'
class About extends Component {

  componentDidMount() {
    this.props.setPageTitle(`About this tool`)
  }

  render () {
    return (
      <div className="about-page">

        <div className="md-grid grid-max-width">
            <div className="md-cell md-cell--3-desktop-offset md-cell--6 md-cell--12-tablet">
                <h3>How does it work?</h3>
                The bugs that this tool displays are generated by the <a rel="noopener noreferrer" target="_blank" href="https://www.oipa.nl">OIPA</a> parser, which parses IATI files of all versions. 

                OIPA has the incentive to parse IATI as strictly as possible, and hence it throws loads of validation errors. 

                <br /><br />
                These validation errors are stored with the dataset and exposed through the datasets endpoint of the <a rel="noopener noreferrer" target="_blank" href="https://www.oipa.nl/api/">OIPA API</a>. 

                This tool is a React (Javascript) app that directly uses that endpoint to display aggregated and detailed error information.

            </div>
        </div>
        <div className="md-grid grid-max-width">
            <div className="md-cell md-cell--3-desktop-offset md-cell--6 md-cell--12-tablet">
                <h3>Roadmap</h3>
                The aim of this tool is to show all validation errors. Other features will be kept limited as I'd rather want to spent time on helping the <a rel="noopener noreferrer" target="_blank" href="http://discuss.iatistandard.org/t/work-towards-an-improved-iati-validator/524/1">new IATI validator</a> to be feature rich. 


            </div>
        </div>
        <div className="md-grid grid-max-width">
            <div className="md-cell md-cell--3-desktop-offset md-cell--6 md-cell--12-tablet">
                <h3>The backstory</h3>
                
                I'm Vincent van 't Westende, a developer at <a rel="noopener noreferrer" target="_blank" href="https://www.zimmermanzimmerman.nl">Zimmerman & Zimmerman</a>. 

                We develop and maintain <a rel="noopener noreferrer" target="_blank" href="https://www.oipa.nl">OIPA</a>, a tool that provides API access to all published IATI files. 
                OIPA serves as data engine for <a rel="noopener noreferrer" target="_blank" href="https://www.iatistudio.com">IATI Studio</a>, <a rel="noopener noreferrer" target="_blank" href="https://devtracker.dfid.gov.uk/">DevTracker</a>, <a rel="noopener noreferrer" target="_blank" href="https://www.openaid.nl">OpenaidNL</a>, <a rel="noopener noreferrer" target="_blank" href="https://aiddata.rvo.nl/">Dutch Enterprise Agency - Aid Data</a>, <a rel="noopener noreferrer" target="_blank" href="http://opendata.unesco.org">UNESCO Open Data</a>, <a rel="noopener noreferrer" target="_blank" href="http://open.unhabitat.org">Open UN-Habitat</a>, <a rel="noopener noreferrer" target="_blank" href="http://www.rainfoundation.org">RAIN Foundation</a> and <a rel="noopener noreferrer" target="_blank" href="http://urbandata.unhabitat.org/">UN-Habitat - Urban data</a>.

                <br /><br />
                I recently went through the logs of the OIPA parser and found tons of validation errors of which some I coulnd't find on the IATI Dashboard. 
                At the same time these logs are time-consuming to check while an interface would make it far easier.
                So why not make them transparent through the OIPA API and build a dashboard to make publishers aware. 
                This should only have winners; publishers have an extra tool to check correctness of their data, bugs in the OIPA parser are spotted earlier through feedback on this tool, and OIPA developers have an easier interface to check (a subset of) the parser logs. 
                <br /><br />
                Please keep in mind this is just a first version, built in my own time as a quick prototype without much testing, so it might contain bugs here in there. I'm also no designer nor a user experience expert so feel free to suggest improvements on that part!
                


            </div>
        </div>

        <div className="md-grid grid-max-width">
            <div className="md-cell md-cell--3-desktop-offset md-cell--6 md-cell--12-tablet">
                <h3>Contact</h3>
                
                I have no idea if anyone will use this and if it will cause response, so for now feel free to <a rel="noopener noreferrer" target="_blank" href="https://twitter.com/vwestende">tweet me</a> on anything regarding this dashboard (features, bugs, re-parsing, etcetera).

                <br /><br />
                There's a <a rel="noopener noreferrer" target="_blank" href="https://trello.com/b/cAa0ryxh/iati-bugs">Trello board</a> ready for bugs / feature requests.
               
            </div>
        </div>


        
      </div>
    )
  }
}


export default connect(null, {
  setPageTitle,
})(About)
