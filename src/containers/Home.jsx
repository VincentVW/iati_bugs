import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setPageTitle } from '../actions/header'

import UserStoryCard from '../components/helpers/UserStoryCard'


class Home extends Component {

  constructor(props){
    super(props)
    this.clickLink = this.clickLink.bind(this)
  }

  componentDidMount(){
    this.props.setPageTitle(`Welcome to IATI Bug Tracker`)
  }

  clickLink(link){
    this.context.router.history.push(link)
  }

  changeQuery (e){
        const value = e.target.value
        
        clearTimeout(this.timeout)

        const setQuery = this.setQuery

        const enterPressed = e.key === 'Enter'

        this.timeout = setTimeout(function () {
            setQuery(value)
            
        }, enterPressed ? 0 : 2000);
    }

  render () {
    return (

      <div id="homepage">
        <div className="md-grid grid-max-width homepage-intro">
          <div className="md-cell md-cell--3-desktop-offset md-cell--6-desktop md-cell--12-tablet center-items">
            <img alt="website logo" src='/favicon.png' width="100" height="100" />
            This tool shows insights on data bugs in all IATI datasets published through the IATI Registry.

            At the moment there's no place to fully check validation and that probably hurts the overall data quality.

            This an effort to expose missing IATI validation checks and to provide more in-depth info on where these errors occur.   

          </div>
        </div>
        <div className="md-grid grid-max-width">
          <UserStoryCard 
            title='Find your organisation and check your errors'
            subtitle='"I want to know if my organisation has validation errors"'
            imgSrc='/images/home-card-1-v2.png'
            imgLink='/publishers/' />

          <UserStoryCard 
            title="What's wrong and where does the error occur?"
            subtitle='"I want to have in depth information on my errors"'
            imgSrc='/images/home-card-4-v2.png'
            imgLink='/datasets/' />

        </div>
        <div className="md-grid grid-max-width">
         
          <UserStoryCard 
            title='Find out which elements cause trouble for publishers'
            subtitle='"I want to know the commonly made errors"'
            imgSrc='/images/home-card-3-v2.png'
            imgLink='/common-bugs/' />

          <UserStoryCard 
            title='366 out of 372 checks covered'
            subtitle='"I want to know what checks this tool performs"'
            imgSrc='/images/home-card-2-v2.png'
            imgLink='/implemented-checks/' />

        </div>
      </div>
    )
  }
}

Home.contextTypes = {
  router: PropTypes.shape({
    history: PropTypes.object.isRequired,
  }),
}


export default connect(null, {
  setPageTitle,
})(Home)

