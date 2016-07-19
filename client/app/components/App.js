import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import DocumentTitle from "react-document-title"
import classNames from 'classnames'
import NavBar from './NavBar.jsx'
import Loader from './Loader.jsx'


const App = React.createClass({
    render: function() {
        return (
            <DocumentTitle title='IATI bug swarm'>
                <div>
                    <NavBar></NavBar>
                    <Loader></Loader>
                    <div id="content-wrap">
                    { this.props.children }
                    </div>
                </div>
            </DocumentTitle>
        )
    }
})

export default App
