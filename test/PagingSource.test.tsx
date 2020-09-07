/**
 * Created by Adrian Pascu at 07-Sep-20
 */

import PagingSource from "../src/data/PagingSource";
import {name} from 'faker'

describe("Test paging source implementation", () => {

    //Get some mock data
    const mockData = Array(10).map(_ => name.findName())

    //Define a paging source
    class MockPagingSource extends PagingSource<string> {
        async _getPage(pageIndex: number): Promise<string[]> {
            return mockData.slice(pageIndex * this.pageSize, (pageIndex + 1) * this.pageSize)
        }

        async getDatasetSize(): Promise<number> {
            return Promise.resolve(mockData.length);
        }

    }

    it("Get paged data", async () => {
        const pagingSource: MockPagingSource = new MockPagingSource(2)

        //Get some pages and assert
        const currentPage = await pagingSource.CurrentPage
        const page3 = await pagingSource._getPage(3)
        expect(currentPage).toEqual([mockData[0], mockData[1]])
        expect(page3).toEqual([mockData[6], mockData[7]])
    })
})