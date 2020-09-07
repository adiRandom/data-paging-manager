/**
 * Created by Adrian Pascu at 07-Sep-20
 */

/**
 * Class to define a source of data for paging components
 * @type T - The type of a single object of data
 * @member pageSize = How many items per page
 */
export default abstract class PagingSource<T> {

    constructor(public pageSize: number) {
    }

    // The index of the page currently served
    private _currentPageIndex = 0

    private _currentPage: T[] | null = null

    get CurrentPage(): Promise<T[]> {
        if (this._currentPage)
            return Promise.resolve(this._currentPage)
        else {
            return this._getPage(this._currentPageIndex).then(page => {
                // Caching the current page
                this._currentPage = page
                return page
            })
        }
    }

    // private getPage(pageIndex:number):Promise<T[]>{
    //
    // }

    //Get a page of data
    async abstract _getPage(pageIndex: number): Promise<T[]>

    async abstract getDatasetSize(): Promise<number>
}