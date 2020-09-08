`data-paging-manager ` is a Typescript-first React library to paginate data, cache it and display it in different forms.

## Install

    npm install --save data-paging-manager

## Usage

To use the library, you need to define a data source, which is achieved extending the `PagingSource` class. After that, you can choose between `PagingContainer` and `ListPagingContainer` to display the data

## PagingSource<T>

`PagingSource` is an abstract class with which you define how the React components get the data. It is a generic class where `T` is the type of a single element from the dataset that the user wants to display
  There are two methods that need to be overridden:

    protected async abstract _getPage(pageIndex:number):Promise<T[]>

If we think of portion of fixed length of data as a page, this method defines how does the library fetch the page at index  `pageIndex` . Internally, this method is used to fetch and cache the data in pages. The method returns a promise that holds a page of data, meaning a list that holds a portion of the whole dataset.

	public async abstract getDatasetSize():Promise<number>

This method returns the size of the entire dataset that gets paginates.


The constructor of `PagingSource` gets a single parameter, `pageSize : number` which means how many items are per page.

PagingsSource cahces all pages that get requested and also when a page gets requested it also asynchronously pre-fetches and caches adjacent pages for a smoother experience. When requesting a page, it becomes available to be consumed before the pre-fetching starts.

 

## PagingSource - properties and methods available

 - PageIndex : number  -  The index of the page that is currently shown to the user
 - CurrentPage : Promise\<T> - A property that holds the current page 
 - async changePage(pageIndex:number : Promise\<void> - Function that changes the current page. The function returs when the page gets availabele. It doesn't return the actuall page. For that you need to access `CurrentPage` after this function returns
 - pageSize: `number` -The number of items are per page
 
 ## PagingContainer\<T>

This is the main component to display the data that is being paged. It gets a `PagingSource` as a prop and passes down a set of `PagingProps` to its children. It is a generic where `T` is the type of a single item from the dataset.

## PagingContainer props

 - pagingSource : `PagingSource\<T>`
 - style :` React.CSSProperties?` - styles to be passed to the container
 - className : `string? `- CSS class to be passed to the container

## PagingProps\<T>

- data: `T[]` - A page of data, where each item has a type of `T`
- next : `() => void` - Function to request the next page
- prev : `() =>void` - Function to request the previous page
- pageIndex :` number` - The index of the current page

## ListPagingContainer\<T>

The other component that can display the paged data. Unlike `PagingContainer` it gets a `ReactElement` as a prop and manages the list of items itself. 

The UI isn't as customizable as a consequence, but it is easier to implement and it enables infinite scrolling ( pages get fetched automatically when a scroll threshold is met). It is also a generic.

For infinite scroll mode, `PagingSource.pageSize` refers to how many items gets fetched at once.

## ListPagingContainer props

 - pagingSource :` PagingSource\<T>`
 - style : `React.CSSProperties?` - styles to be passed to the container
 - className : `string?` - CSS class to be passed to the container
 - element : `(data : T) => ReactElement` -  A function that gets a single item from the current page and returns a `ReactElement` to display that item
 - pageIndex : `number?` - The index of the page to be displayed. Unlike `PagingContainer` this isn't handled internally. It is not required when `infiniteScroll` is `true`
 - infiniteScroll : `boolean?` - A flag to set the infinite scroll mode. Defaults to false
 - threshold : `number?` - When the item with this index (counting from the bottom) is visible, fetch the next page. Only used for infinite scroll mode. Defaults to `1`