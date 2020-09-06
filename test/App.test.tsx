import {create} from 'react-test-renderer'
import App from "../src/App";
import React from "react";

it("Test App renders correctly", () => {
    const app = create(<App/>)
    expect(app.toJSON()).toMatchSnapshot()
});