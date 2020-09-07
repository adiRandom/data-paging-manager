/**
 * Created by Adrian Pascu at 06-Sep-20
 */

import React, {Fragment} from 'react'
import {name} from 'faker'
import PagingContainer from "./components/PagingContainer";
import {PagingProps} from "./types/PagingProps";
import PagingSource from "./data/PagingSource";

const App = () => {

    return (
        <PagingContainer pagingSource={new MyPagingSource(2)}>
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

class MyPagingSource extends PagingSource<string> {
    private readonly mockData: string[] = []

    constructor(pageSize: number) {
        super(pageSize);

        for (let i = 0; i < 10; i++)
            this.mockData.push(name.findName())

    }

    protected async _getPage(pageIndex: number): Promise<string[]> {
        return this.mockData.slice(pageIndex * this.pageSize, (pageIndex + 1) * this.pageSize)
    }

    async getDatasetSize(): Promise<number> {
        return this.mockData.length
    }

}


export default App
