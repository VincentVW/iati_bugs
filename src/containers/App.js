import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { Route, Switch } from 'react-router-dom'

import Home from './Home.jsx'
import ImplementedChecks from './ImplementedChecks.jsx'
import PublisherList from './PublisherList.jsx'
import Publisher from './Publisher.jsx'
import DatasetsPage from './DatasetsPage.jsx'
import Dataset from './Dataset.jsx'
import CommonErrors from './CommonErrors.jsx'
import About from './About.jsx'

import Activity from './Activity.jsx'


import ErrorPage from './ErrorPage.jsx'
import NavigationDrawer from 'react-md/lib/NavigationDrawers'
import FontIcon from 'react-md/lib/FontIcons'


import cn from 'classnames'
import URLSearchParams from 'url-search-params'
import NavToolBar from '../components/helpers/NavToolBar'

import store from '../index'
import { push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'


const menuItems = [
    {
      key: '/',
      primaryText: 'Intro',
      leftIcon: <FontIcon>home</FontIcon>,
      active: true,
    },{
      key: '/publishers',
      primaryText: 'Publishers',
      leftIcon: <FontIcon>device_hub</FontIcon>,
    }, {
      key: '/datasets',
      primaryText: 'Datasets',
      leftIcon: <FontIcon>note</FontIcon>,
    }, {
      key: '/common-bugs',
      primaryText: 'Common bugs',
      leftIcon: <FontIcon>cached</FontIcon>,
    }, {
      key: '/implemented-checks',
      primaryText: 'Implemented checks',
      leftIcon: <FontIcon>playlist_add_check</FontIcon>,
    }, {
      key: '/about',
      primaryText: 'About',
      leftIcon: <FontIcon>note</FontIcon>,
    }
]


class App extends Component {

    constructor(props, context){
        super(props, context)

        this._navItems = menuItems.map(item => {
          if (!item.divider) {
            item.onClick = () => this._setPage(item.key)
          }
          return item
        })

        const params = new URLSearchParams(context.router.route.location.search)
        const tabIndex = params.get('tab') || 0

        this.state = { 
            key: menuItems[0].key,
            tabIndex
        }

        this.context.router.history.listen((location, action) => {

            var prevActiveItems = this._navItems.filter((o) => o.active)
            prevActiveItems.forEach((o) => {
                o.active = false;
            })

            let activeItem = this._navItems.find((o) => o.key === location.pathname)
            if(activeItem) { activeItem.active = true }


        })

        this._setPage = this._setPage.bind(this)
    }

    _setPage(key) {
        store.dispatch(push(key))
    }

    render() {
        const { pageTitle } = this.props

        return (
            <div>
                <NavigationDrawer
                    ref="main-drawer"
                    autoclose={true}
                    drawerTitle='IATI Bug Tracker'
                    navItems={this._navItems}

                    mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
                    tabletDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
                    desktopDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY}
                    
                    toolbarTitle={pageTitle}
                    toolbarClassName={cn('main-toolbar')}
                    toolbarProminent={false}

                    contentId="main-content-wrapper"
                    toolbarChildren={null}
                    toolbarActions={<NavToolBar />}
                >
                    <div id="main-section">
                        <Switch>
                            
                            <Route exact={true} path="/" component={Home}/>
                            
                            <Route exact={true} path="/implemented-checks" component={ImplementedChecks} />
                            
                            <Route exact={true} path="/publishers" component={PublisherList} />
                            <Route path="/publishers/:publisherId" component={Publisher}/>
                            <Route exact={true} path="/datasets" component={DatasetsPage} />
                            <Route path="/datasets/:datasetId" component={Dataset} />
                            <Route path="/common-bugs" component={CommonErrors} />
                            <Route exact={true} path="/about" component={About} />
                            
                            <Route path="/activities/:activityId" component={Activity} />
                            
                            { /*
                            <Route exact={true} path="/datasets" component={DatasetList} />
                            */ }
                            <Route path="*" component={ErrorPage}/>

                        </Switch>
                    </div>
                    <AppFooter />
            
                </NavigationDrawer>
                

            </div>
        )
    }
}


App.contextTypes = {
  router: PropTypes.object
}


class AppFooter extends Component {
    render(){
        return(
            <footer>
                <div className="md-grid">
                    <div className="md-text-center md-cell md-cell--12"></div>
                </div>
            </footer>
        )
    }
}


function mapStateToProps(state, props) {
    const { header } = state
    return {
        pageTitle: header.pageTitle
    }
}
export default withRouter(connect(mapStateToProps, {})(App))