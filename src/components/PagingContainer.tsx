/**
 * Created by Adrian Pascu at 06-Sep-20
 */

import React, {ReactElement} from 'react'


/**
 * The props for PagingContainer
 * @property data - The data to be paged
 * @property element - The child to receive the paged data
 * @property className - Root element css class
 * @property style - Root element styling
 */
type PagingContainerProps<T> = {
    data: T[],
    children: ReactElement,
    style?: React.CSSProperties,
    className?: string
}


/**
 * The main component of the paging library.
 * Responsible of passing down the paged data to the child components
 * @constructor props - Component props
 * @type T - The type of data to be paged
 */
const PagingContainer = <T extends unknown>({data, children, style, className}: PagingContainerProps<T>) => {
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child))
            return React.cloneElement(child, {
                data: data
            } as any)
    })
    return (
        <div className={`paging-container-root ${className}`} style={style}>
            {childrenWithProps}
        </div>
    )
}

export default PagingContainer