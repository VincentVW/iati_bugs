import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TextField from 'react-md/lib/TextFields'

import Button from 'react-md/lib/Buttons/Button'
import { setPageTitle } from '../actions/header'

import UserStoryCard from '../components/helpers/UserStoryCard'

import CardText from 'react-md/lib/Cards/CardText';
import CardActions from 'react-md/lib/Cards/CardActions';

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

      <div>
        <div className="md-grid grid-max-width homepage-intro">
          <div className="md-cell md-cell--3-offset md-cell--6 center-items">
            <img alt="website logo" src='/favicon.png' width="100" height="100" />
            This tool shows insights on data bugs in all IATI datasets published through the IATI Registry.

            At the moment there's no place to fully check validation and that probably hurts the overall data quality.

            This an effort to expose missing IATI validation checks and to provide more in-depth info on where these errors occur.   

          </div>
        </div>
        <div className="md-grid grid-max-width">
             <UserStoryCard 
                title='"I want to know if my organisation has validation errors"'
                subtitle='Find your organisation and check what improvements you can make'
                imgSrc='/img/test.png'
                cardText="Cras justo odio, dapibus ac facilisis in, egestas eget quam. Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Donec id elit non mi porta gravida at eget metus.">

                 <TextField
                  id="activity-search-input"
                  onKeyDown={this.changeQuery}
                  label="Search by publisher name or id..."
                  lineDirection="center"
                  placeholder=""
                  className=""
                />
          
                <CardActions expander>
                  <Button raised label="View the publishers in a list" />
                  &nbsp;
                  <Button raised label="View the datasets in a list" />
                </CardActions>
                <CardText style={{minHeight: '200px'}} expandable>
                  {this.props.cardText} 
                </CardText>

              </UserStoryCard>

              <UserStoryCard 
                title='"I want to know what checks this tool performs"'
                subtitle='<todo> out of <todo> known checks covered'
                implemented={true}>

                                    
                <TextField
                  id="activity-search-input"
                  onKeyDown={this.changeQuery}
                  label="Search by publisher name or id..."
                  lineDirection="center"
                  placeholder=""
                  className=""
                />
              </UserStoryCard>

        </div>
        <div className="md-grid grid-max-width">
             <UserStoryCard 
                title='"I want to know the commonly made errors"'
                subtitle='Find out which elements cause trouble for publishers'
                implemented={true}>

                <TextField
                  id="activity-search-input"
                  onKeyDown={this.changeQuery}
                  label="Search by publisher name or id..."
                  lineDirection="center"
                  placeholder=""
                  className=""
                />

              </UserStoryCard>

              <UserStoryCard 
                title='"I want to know more about the background of this tool"'
                subtitle='How does it work, who, what and why?'
                implemented={true}>

              </UserStoryCard>

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

