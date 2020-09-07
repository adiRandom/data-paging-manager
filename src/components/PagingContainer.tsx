/**
 * Created by Adrian Pascu at 06-Sep-20
 */

import React, {ReactElement, useEffect, useState} from 'react'
import {PagingProps} from "../types/PagingProps";
import PagingSource from "../data/PagingSource";


/**
 * The props for PagingContainer
 * @property PagingSource - The source of data to be paged
 * @property element - The child to receive the paged data
 * @property className - Root element css class
 * @property style - Root element styling
 * @property pageSize - How many elements on a page
 */
type PagingContainerProps<T> = {
    pagingSource: PagingSource<T>,
    children: ReactElement,
    style?: React.CSSProperties,
    className?: string,
}


/**
 * The main component of the paging library.
 * Responsible of passing down the paged data to the child components
 * @constructor props - Component props
 * @type T - The type of data to be paged
 */
const PagingContainer = <T extends unknown>({pagingSource, children, style, className}: PagingContainerProps<T>) => {

    const [childrenWithProps, setChildrenWitProps] = useState(getChildrenWithProps([]))

    //Flag to signal that the data has changed
    const [pageChanged, setPageChanged] = useState(true)

    //Paged changed
    useEffect(() => {
        if (pageChanged) {
            pagingSource.CurrentPage.then(page => setChildrenWitProps(getChildrenWithProps(page)))
            setPageChanged(false)
        }
    }, [pageChanged])

    function getChildrenWithProps(data: T[]) {
        return React.Children.map(children, child => {
            if (React.isValidElement(child))
                return React.cloneElement(child, {
                    data,
                    prev,
                    next,
                    pageIndex: pagingSource.PageIndex
                } as PagingProps<T>)
        })
    }

    /**
     * Get the next page of data
     * @return True if the current page is the last page
     */
    async function next() {
        await pagingSource.changePage(pagingSource.PageIndex + 1)
        const size = await pagingSource.getDatasetSize()
        setPageChanged(true)
        return pagingSource.PageIndex + 1 == size / pagingSource.pageSize
    }

    /**
     * Get the previous page of data
     * @return True if the current page is the first page
     */
    async function prev() {
        await pagingSource.changePage(pagingSource.PageIndex - 1)
        setPageChanged(true)
        return pagingSource.PageIndex == 0
    }


    return (
        <div className={`paging-container-root ${className}`} style={style}>
            {childrenWithProps}
        </div>
    )
}

export default PagingContainer