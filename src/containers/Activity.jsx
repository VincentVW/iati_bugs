import React, { Component } from 'react'
import { connect } from 'react-redux'
import {oipaApiUrl} from '../config'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'

import ForceGraph from '../components/activities/ForceGraph'

import { setPageTitle } from '../actions/header'


class Activity extends Component {

  constructor (props, context) {
    super(props, context)

    this.state = {
        activity: {},
        pageError: null,
        activities: {},
        activitiesLoading: true,
        chainErrors: [],
        chainErrorsLoading: true,
        chainLinks: [],
        chainNodes: []
    }
  }

  componentDidMount(){
    this.props.setPageTitle(`Chain of ${this.context.router.route.match.params.activityId}`)
    this.getActivity()
  }

  getChain(root_activity){
    fetch(oipaApiUrl + `chains/?format=json&includes_activity=${this.context.router.route.match.params.activityId}`)
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if(json.results.length === 1){

          const chain = json.results[0]
          this.setState({chain: chain})
          this.getChainActivities(chain)
          this.getChainErrors(chain)
          this.getChainNodes(chain)

        } else {
            this.setState({pageError: 'chain not found or multiple chains found'})
        }
      }
    )
  }

  getChainActivities(chain){
    fetch(oipaApiUrl + `chains/${chain.id}/activities/?format=json&page_size=400&fields=id,reporting_organisation,title,iati_identifier,recipient_countries,recipient_regions,locations,sectors`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {

        var activities  = json.results.reduce(function(map, obj) {
            map[obj.id] = obj;
            return map;
        }, {});

        this.setState({
          activities: activities,
          activitiesLoading: false
        })

        this.getChainLinks(chain)
      }
    )
  }

  getChainErrors(chain){
    fetch(oipaApiUrl + `chains/${chain.id}/errors/?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        // based upon chainerrors, enrich the tree with broken links. 
        this.setState({
          chainErrors: json.filter((o) => ['warning', 'error'].includes(o.warning_level)),
          chainErrorsLoading: false
        })
      }
    )
  }

  getChainLinks(chain){
    fetch(oipaApiUrl + `chains/${chain.id}/links/?format=json&ordering=id`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({chainLinks: json})
      }
    )
  }

  getChainNodes(chain){
    fetch(oipaApiUrl + `chains/${chain.id}/nodes/?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {

        const nodes = _.chain(json)
          .groupBy((row) => {
            return row.id
          })
          .value()
        this.setState({chainNodes: nodes})
      }
    )
  }

  getActivity(){
    fetch(oipaApiUrl + `activities/${this.context.router.route.match.params.activityId}/?format=json`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({activity: json})
        this.getChain(json)

        if (json.title.narratives.length){
          this.props.setPageTitle(`Chain of ${json.title.narratives[0].text}`)
        }
      }
    )
  }

  componentDidUpdate(prevProps, prevState, prevContext){
    if(prevContext.router.route.match.params.activityId !== this.context.router.route.match.params.activityId){

      this.props.setPageTitle(`Chain of ${this.context.router.route.match.params.activityId}`)
      this.getActivity()

    }
  }

  render () {

    const { 
        activity,
        activities, 
        activitiesLoading, 
        chainErrors, 
        chainLinks, 
        chainErrorsLoading, 
        pageError,
        chainNodes
    } = this.state

    if(activitiesLoading || chainErrorsLoading || pageError !== null){
        return (
            <div className="large-12 columns">
                {pageError}
            </div>
        )
    }

    return (
      <div>
            <ForceGraph activity={activity} links={chainLinks} loading={chainErrorsLoading || activitiesLoading} chainErrors={chainErrors} activities={activities} />
            { //<ChainCharacteristics activities={activities} />
        }
      </div>
    )
  }
}

Activity.contextTypes = {
  router: React.PropTypes.shape({
    history: React.PropTypes.object.isRequired,
  }),
}


function mapStateToProps(state, props) {
    const { header } = state
    return {
      currentTab: header.currentTab
    }
}


export default connect(mapStateToProps, {
  setPageTitle,
})(Activity)



