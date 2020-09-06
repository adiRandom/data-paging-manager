/**
 * Created by Adrian Pascu at 06-Sep-20
 */

import React, {Fragment} from 'react'
import {name} from 'faker'
import PagingContainer from "./components/PagingContainer";
import {PagingProps} from "./types/PagingProps";

const App = () => {
    //Mock paging data
    const data = []
    for (let i = 0; i < 10; i++)
        data.push(name.findName())
    return (
        <PagingContainer pageSize={2} data={data}>
            <MyList/>
        </PagingContainer>
    )
}

const MyList = ({data, next, prev}: Partial<PagingProps<string>>) => (

    <Fragment>
        <ul>
            {data?.map((val: string) => <li>{val}</li>)}
        </ul>
        <button onClick={prev}>Prev</button>
        <button onClick={next}>Next</button>
    </Fragment>
)

export default App
