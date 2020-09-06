/**
 * Created by Adrian Pascu at 06-Sep-20
 */

import React from 'react'
import {name} from 'faker'
import PagingContainer from "./components/PagingContainer";

const App = () => {
    //Mock paging data
    const data = []
    for (let i = 0; i < 10; i++)
        data.push(name.findName())
    return (
        <PagingContainer data={data}>
            <MyList/>
        </PagingContainer>
    )
}

const MyList = (props: any) => (
    <ul>
        {props.data.map((val: string) => <li>{val}</li>)}
    </ul>
)

export default App
