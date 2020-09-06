/**
 * Created by Adrian Pascu at 06-Sep-20
 */

import React, {ReactElement, useEffect, useState} from 'react'
import {PagingProps} from "../types/PagingProps";


/**
 * The props for PagingContainer
 * @property data - The data to be paged
 * @property element - The child to receive the paged data
 * @property className - Root element css class
 * @property style - Root element styling
 * @property pageSize - How many elements on a page
 */
type PagingContainerProps<T> = {
    data: T[],
    children: ReactElement,
    style?: React.CSSProperties,
    className?: string,
    pageSize: number
}


/**
 * The main component of the paging library.
 * Responsible of passing down the paged data to the child components
 * @constructor props - Component props
 * @type T - The type of data to be paged
 */
const PagingContainer = <T extends unknown>({data, children, style, className, pageSize}: PagingContainerProps<T>) => {


    // The slice of data
    const [leftIndex, setLeftIndex] = useState(0)
    const [rightIndex, setRightIndex] = useState(pageSize - 1)

    const [childrenWithProps, setChildrenWitProps] = useState(getChildrenWithProps(data.slice(0, pageSize), 0, pageSize - 1))

    //Paged changed
    useEffect(() => {
        const page = data.slice(leftIndex, rightIndex + 1)
        setChildrenWitProps(getChildrenWithProps(page, leftIndex, rightIndex))
    }, [leftIndex, rightIndex])

    function getChildrenWithProps(data: T[], left: number, right: number) {
        return React.Children.map(children, child => {
            if (React.isValidElement(child))
                return React.cloneElement(child, {
                    data: data,
                    prev: () => prev(left),
                    next: () => next(right)
                } as PagingProps<T>)
        })
    }

    function next(rightIndex: number) {
        //Check bounds
        if (rightIndex + 1 != data.length) {
            const left = rightIndex + 1
            const right = rightIndex + pageSize

            //Move the slice
            setLeftIndex(left)
            setRightIndex(right)
        }
    }

    function prev(leftIndex: number) {

        //Check bounds
        if (leftIndex != 0) {

            const right = leftIndex - 1
            const left = leftIndex - pageSize
            //Move the slice
            setRightIndex(right)
            setLeftIndex(left)
        }
    }


    return (
        <div className={`paging-container-root ${className}`} style={style}>
            {childrenWithProps}
        </div>
    )
}

export default PagingContainer