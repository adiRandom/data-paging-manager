/**
 * Created by Adrian Pascu at 06-Sep-20
 */


/**
 * The props the children of PagingContainer will receive
 * @property data - The paged data
 * @function next - Get the next page of data
 * @function prev - Get the previous page of data
 */
export type PagingProps<T> = {
    data: T[],
    next: () => void,
    prev: () => void
}