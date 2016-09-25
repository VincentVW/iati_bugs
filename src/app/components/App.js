import React from 'react'

import DocumentTitle from "react-document-title"
import NavBar from './NavBar.jsx'


const App = React.createClass({
    render: function() {
        return (
            <DocumentTitle title='IATI Bug Tracker'>
                <div>
                    <NavBar></NavBar>
                    <div id="content-wrap">
                    { this.props.children }
                    </div>
                </div>
            </DocumentTitle>
        )
    }
})

export default App

