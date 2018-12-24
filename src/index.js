import React from 'react';
import { render } from "react-dom";
import App from './components/App';

import {
    Stitch,
    RemoteMongoClient,
    GoogleRedirectCredential
} from "mongodb-stitch-browser-sdk";

render(<App />, document.getElementById("app"));
