import React from 'react'
import { Route } from "react-router"

import App from './components/App'

import Home from './components/Home.jsx'
import About from './components/About.jsx'
import CommonErrorList from './components/CommonErrorList.jsx'
import Dataset from './components/Dataset.jsx'
import DatasetList from './components/DatasetList.jsx'
import PublisherList from './components/PublisherList.jsx'
import Publisher from './components/Publisher.jsx'
import ImplementedBugs from "./components/ImplementedBugs.jsx"

export default (
    <Route component={App}>
        <Route path="about" component={About}/>
    	<Route path="common-errors" component={CommonErrorList}/>
        <Route path="datasets/:datasetId" component={Dataset}/>
        <Route path="datasets" component={DatasetList}/>
        <Route path="publishers" component={PublisherList}/>
        <Route path="publishers/:publisherId" component={Publisher}/>
        <Route path="implemented-bugs" component={ImplementedBugs}/>
        <Route path="*" component={Home}/>
    </Route>
)
