/**
 * Created by Adrian Pascu at 07-Sep-20
 */

import PagingSource from "../src/data/PagingSource";
import {name} from 'faker'

describe("Test paging source implementation", () => {

    //Get some mock data
    const mockData: string[] = []
    for (let i = 0; i < 10; i++)
        mockData.push(name.findName())

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

    it("Change the page", async () => {
        const pagingSource: MockPagingSource = new MockPagingSource(2)

        //Get the first page
        let currentPage = await pagingSource.CurrentPage
        expect(currentPage).toEqual([mockData[0], mockData[1]])

        //Change the page

        await pagingSource.changePage(3)
        currentPage = await pagingSource.CurrentPage
        expect(currentPage).toEqual([mockData[6], mockData[7]])
    })

    it("Caching and fetch ahead", async () => {
        const pagingSource: MockPagingSource = new MockPagingSource(2)

        //Get some pages
        const currentPage = await pagingSource.CurrentPage
        const page3 = await pagingSource.changePage(3)

        //Get the cache and test if all the pages that were supposed to be pre-fetched are there
        const cache: string[][] = pagingSource['cache']

        expect(cache).toHaveLength(5)
        expect(cache[4]).toEqual([mockData[8], mockData[9]])
        expect(cache[1]).toEqual([mockData[2], mockData[3]])
        expect(cache[2]).toEqual([mockData[4], mockData[5]])
    })
})