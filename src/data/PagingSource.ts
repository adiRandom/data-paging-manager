/**
 * Created by Adrian Pascu at 07-Sep-20
 */

/**
 * Class to define a source of data for paging components
 * @type T - The type of a single object of data
 * @member pageSize = How many items per page. For infinite mode, this means how many items loads at once
 */
export default abstract class PagingSource<T> {

    constructor(public pageSize: number) {
    }

    // The index of the page currently served
    private _currentPageIndex = 0

    get PageIndex() {
        return this._currentPageIndex
    }

    // Caches the pages of data
    private cache: T[][] = []

    get CurrentPage(): Promise<T[]> {
        const currentPage = this.cache[this._currentPageIndex]
        if (currentPage)
            return Promise.resolve(currentPage)
        else {
            // If the page hasn't already been fetched then it hasn't been requested by calling this.changePage()
            // Also fetch the adjacent pages
            return this.fetchAndCacheAhead(this._currentPageIndex) as Promise<T[]>
        }
    }


    /**
     *  Change the page being served if is not out of bounds
     *  @return The function returns when the requested page is available.
     */

    async changePage(pageIndex: number) {

        //Check bounds

        const size = await this.getDatasetSize()

        // Check boundaries
        if (pageIndex < size / this.pageSize && pageIndex >= 0) {
            //Change the page index
            this._currentPageIndex = pageIndex

            if (this.cache[pageIndex]) {
                //    The page has been cached so no need to fetch it

                //    Start a background fetch to get the prev and next page cached for a smoother experience
                this.fetchAndCache(pageIndex - 1)
                this.fetchAndCache(pageIndex + 1)
                return

            } else {
                //    Fetch both the current page and the adjacent ones
                return this.fetchAndCacheAhead(pageIndex).then(_ => {
                })
            }
        }
    }

    /**
     * Fetch a page and cache it
     * @param pageIndex
     * @private
     * @return The fetched page or undefined if trying to fetch an out of bounds page
     */
    private async fetchAndCache(pageIndex: number) {
        const size = await this.getDatasetSize()

        // Check boundaries
        if (pageIndex < size && pageIndex >= 0) {
            //Page hasn't already been cached
            if (!this.cache[pageIndex]) {
                const page = await this._getPage(pageIndex)
                this.cache[pageIndex] = page
                return page
            } else {
                // Page had already been cached
                return this.cache[pageIndex]
            }
        }
    }


    /**
     * Fetch a page and cache it. Also do that for the adjacent pages, without waiting for a result
     * @param pageIndex
     * @private
     * @return The fetched page or undefined if trying to fetch an out of bounds page
     */
    private async fetchAndCacheAhead(pageIndex: number) {
        return this.fetchAndCache(pageIndex).then(page => {
            this.fetchAndCache(pageIndex - 1)
            this.fetchAndCache(pageIndex + 1)
            return page
        })
    }

    /**
     * Get a page of data
     *@private
     */
    protected async abstract _getPage(pageIndex: number): Promise<T[]>

    async abstract getDatasetSize(): Promise<number>
}