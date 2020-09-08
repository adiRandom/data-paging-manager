/**
 * Created by Adrian Pascu at 08-Sep-20
 */
import PagingSource from "../data/PagingSource";
import React, {CSSProperties, ReactElement, useEffect, useState} from "react";

type ListPagingContainerProps<T> = {
    pagingSource: PagingSource<T>,
    element: (data: T) => ReactElement,
    style?: CSSProperties,
    className?: string,
    pageIndex?: number,
    infiniteScroll?: boolean,
    threshold?: number,
}

/**
 * Component to display paged data.
 * Unlike PagingContainer, ListPagingContainer renders the list of items itself
 * This enables infinite scroll mode
 * @param pagingSource - The source of data
 * @param element - A list element
 * @param className - CSS class for the list container
 * @param style - CSS styling for the container
 * @param pageIndex - The current page. Only for normal mode
 * @param infiniteScroll - Render a list with all elements fetched dynamically
 * @param threshold - How many items left to see before fetching the next batch. Only for infinite scroll
 */
const ListPagingContainer = <T extends unknown>({pagingSource, element, className, style, pageIndex = 0, infiniteScroll = false, threshold = 1}: ListPagingContainerProps<T>) => {

    const [data, setData] = useState([] as T[])

    // Page index state for infinite scroll
    const [mPageIndex, setMPageIndex] = useState(0)

    //Flag for infinite scroll to trigger fetch event
    const [shouldFetch, setShouldFetch] = useState(false)

    //Dataset size
    const [size, setSize] = useState(0)

    const [observedNode, setObservedNode] = useState(null as HTMLElement | null)


    // Observe the node
    useEffect(() => {
        //No need to observe this node if we are fetching data
        if (!shouldFetch && observedNode) {
            intersectionObserver.disconnect()
            intersectionObserver.observe(observedNode)
        }
    }, [observedNode])

    // Fetch effect for infinite scroll
    useEffect(() => {
        if (shouldFetch) {
            pagingSource.changePage(mPageIndex + 1).then(_ => pagingSource.CurrentPage).then(page => setData([...data, ...page]))
            setMPageIndex(mPageIndex + 1)
            setShouldFetch(false)
        }
    }, [shouldFetch])

    // Get dataset size
    useEffect(() => {
        pagingSource.getDatasetSize().then(val => setSize(val))
    }, [])

    // Fetch the next batch of data for infinite scroll
    const fetchNextBatch: IntersectionObserverCallback = (entries, observer) => {
        for (let entry of entries)
            if (entry.isIntersecting) {
                //Boundary check
                if (mPageIndex + 1 < size / pagingSource.pageSize) {
                    intersectionObserver.disconnect()
                    // Initiate data fetching
                    setShouldFetch(true)
                }
            }
    }
    const intersectionObserver = new IntersectionObserver(fetchNextBatch)


    // Get ref from the element that triggers the data fetching to observe it
    function attachRef(node: any) {
        if (node)
            setObservedNode(node)
    }


    // Change page
    useEffect(() => {
        pagingSource.changePage(pageIndex).then(_ => pagingSource.CurrentPage).then(page => setData(page))
    }, [pageIndex])


    if (!infiniteScroll)
        return (
            <div className={`paging-container-root ${className}`} style={style}>
                {data.map(value => element(value))}
            </div>
        )
    else {
        return (<div className={`paging-container-root ${className}`} style={style}>
            {data.map((value, index) => {
                const el = element(value)
                if (data.length - index - 1 == threshold && index != size - threshold - 1 /* The end of the dataset has been reached. No need to observe the element*/) {
                    // Watch the threshold element
                    return React.cloneElement(el, {
                        ref: attachRef
                    })
                } else {
                    return el
                }
            })}
        </div>)
    }
}

export default ListPagingContainer