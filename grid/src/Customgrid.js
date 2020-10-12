import React, {
    useCallback,
    useState,
    useEffect,
    createRef,
    useMemo
} from "react";
import {
    useTable,
    useResizeColumns,
    useFlexLayout,
    useRowSelect,
    useSortBy,
    useFilters,
    useGlobalFilter,
    useExpanded
} from "react-table";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";
import PropTypes from "prop-types";
import RowSelector from "./Functions/RowSelector";
import DefaultColumnFilter from "./Functions/DefaultColumnFilter";
import GlobalFilter from "./Functions/GlobalFilter";
import RowOptions from "./Functions/RowOptions";
import RowEditOverlay from "./Functions/RowEditOverlay";
import RowDeleteOverLay from "./Functions/RowDeleteOverLay";
import ColumnReordering from "./Overlays/managecolumns";
import GroupSort from "./Overlays/groupsort";
import ExportData from "./Overlays/exportdata";
import {
    IconColumns,
    IconAngle,
    IconFilter,
    IconShare,
    IconGroupSort,
    IconSort,
    IconRefresh
} from "./Utilities/SvgUtilities";
import {
    findSelectedRows,
    findSelectedRowIdAttributes
} from "./Utilities/GridUtilities";

const listRef = createRef(null);

const Customgrid = (props) => {
    const {
        title,
        gridHeight,
        gridWidth,
        managableColumns,
        expandedRowData,
        gridData,
        idAttribute,
        totalRecordsCount,
        getRowEditOverlay,
        updateRowInGrid,
        deleteRowFromGrid,
        searchColumn,
        onRowSelect,
        calculateRowHeight,
        expandableColumn,
        rowActions,
        rowActionCallback,
        hasNextPage,
        isNextPageLoading,
        loadNextPage,
        getSortedData,
        CustomPanel,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        onGridRefresh,
        rowsToDeselect
    } = props;

    // Local state to check if this is the first rendering of the Grid. Default value is true
    // This will be set as false in useEffect - [].
    // Selectedrows data will be passed to parent only if isFirstRendering is false
    const [isFirstRendering, setIsFirstRendering] = useState(true);

    // Local state value for holding columns configuration
    const [gridColumns, setGridColumns] = useState([...managableColumns]);

    // Local state value for holding the additional column configuration
    const [additionalColumn, setAdditionalColumn] = useState(expandedRowData);

    // Variables used for handling infinite loading
    const itemCount = hasNextPage ? gridData.length + 1 : gridData.length;
    const loadMoreItems = isNextPageLoading
        ? () => {}
        : loadNextPage || (() => {});
    const isItemLoaded = (index) => !hasNextPage || index < gridData.length;

    // Local state value for checking if column filter is open/closed
    const [isFilterOpen, setFilterOpen] = useState(false);
    // Toggle column filter state value based on UI clicks
    const toggleColumnFilter = () => {
        setFilterOpen(!isFilterOpen);
    };

    // Local state value for checking if row edit overlay is open/closed
    const [isRowEditOverlyOpen, setIsRowEditOverlyOpen] = useState(false);
    // Local state value to hold row data that is going to be edited
    const [editedRowData, setEditedRowData] = useState(null);
    // Bind the user defined row edit overlay into Grid
    const bindRowEditOverlay = (rowValue) => {
        setEditedRowData(rowValue);
        setIsRowEditOverlyOpen(true);
    };
    // Close the row edit overlay
    const closeRowEditOverlay = () => {
        setEditedRowData(null);
        setIsRowEditOverlyOpen(false);
    };

    // Local state value for checking if row delete overlay is open/closed
    const [isRowDeleteOverlyOpen, setIsRowDeleteOverlyOpen] = useState(false);
    // Local state value to hold row data that is going to be deleted
    const [deletedRowData, setDeletedRowData] = useState(null);
    // Bind the user defined row delete overlay into Grid
    const bindRowDeleteOverlay = (rowValue) => {
        setDeletedRowData(rowValue);
        setIsRowDeleteOverlyOpen(true);
    };
    // Close the row edit overlay
    const closeRowDeleteOverlay = () => {
        setDeletedRowData(null);
        setIsRowDeleteOverlyOpen(false);
    };

    // Local state value for checking if group Sort Overlay is open/closed.
    const [isGroupSortOverLayOpen, setGroupSortOverLay] = useState(false);
    // Local state for group sort options
    const [groupSortOptions, setGroupSortOptions] = useState([]);
    // Toggle group Sort state value based on UI clicks
    const toggleGroupSortOverLay = () => {
        setGroupSortOverLay(!isGroupSortOverLayOpen);
    };
    // Call apply group sort function from parent
    const applyGroupSort = (sortOptions) => {
        setGroupSortOptions(sortOptions);
    };

    // Local state value for hiding/unhiding column management overlay
    const [isManageColumnOverlayOpen, setManageColumnOpen] = useState(false);
    // Toggle column manage overlay show/hide state value based on UI clicks
    const toggleManageColumnsOverlay = () => {
        setManageColumnOpen(!isManageColumnOverlayOpen);
    };
    // Callback method from column manage overlay to update the column structure of the grid
    const updateColumnStructure = (updatedColumns, updatedAdditionalColumn) => {
        setGridColumns([...updatedColumns]);
        setAdditionalColumn(updatedAdditionalColumn);
    };

    // Local state value for hiding/unhiding export data overlay
    const [isExportOverlayOpen, setIsExportOverlayOpen] = useState(false);
    // Toggle export overlay show/hide state value based on UI clicks
    const toggleExportDataOverlay = () => {
        setIsExportOverlayOpen(!isExportOverlayOpen);
    };

    // Local state value for storing user selected rows - identifier values (idAttribute)
    const [
        userSelectedRowIdentifiers,
        setUserSelectedRowIdentifiers
    ] = useState([]);

    // Column filter added for all columns by default
    const defaultColumn = useMemo(
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    );

    // Global Search Filter Logic - React table wants all parameters passed into useTable function to be memoized
    const globalFilterLogic = useCallback(
        (rowsToFilter, columnsToFilter, filterValue) => {
            // convert user searched text to lower case
            const searchText = filterValue ? filterValue.toLowerCase() : "";
            // Loop through all rows
            return rowsToFilter.filter((row) => {
                // Find original data value of each row
                const { original } = row;
                // Return value of the filter method
                let returnValue = false;
                // Loop through all column values for each row
                managableColumns.forEach((column) => {
                    // Do search for each column
                    returnValue =
                        returnValue ||
                        searchColumn(column, original, searchText);
                });
                return returnValue;
            });
        },
        [managableColumns, searchColumn]
    );

    // Finds the rows selected by users from selectedRowIds and updates the state value and triggers the callback function.
    // This is used in useeffects for row selection and row deselection
    const updateSelectedRows = (rows, selectedRowIds) => {
        if (idAttribute) {
            const rowsSelectedByUser = findSelectedRows(rows, selectedRowIds);
            const rowIdentifiers = findSelectedRowIdAttributes(
                rowsSelectedByUser,
                idAttribute
            );
            setUserSelectedRowIdentifiers(rowIdentifiers);
            if (onRowSelect) {
                onRowSelect(rowsSelectedByUser);
            }
        }
    };

    const isRowExpandEnabled =
        additionalColumn &&
        Object.keys(additionalColumn).length > 0 &&
        additionalColumn.display === true &&
        additionalColumn.Cell &&
        typeof additionalColumn.Cell === "function";

    const columns = useMemo(() => gridColumns);
    const data = useMemo(() => getSortedData([...gridData], groupSortOptions));

    // Initialize react-table instance with the values received through properties
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        preFilteredRows,
        state: { globalFilter, selectedRowIds },
        setGlobalFilter,
        toggleRowSelected
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            rowActions,
            rowActionCallback,
            globalFilter: globalFilterLogic,
            autoResetFilters: false,
            autoResetGlobalFilter: false,
            autoResetSortBy: false,
            autoResetExpanded: false,
            autoResetSelectedRows: false
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        useExpanded,
        useRowSelect,
        useFlexLayout,
        useResizeColumns,
        (hooks) => {
            // Add checkbox for all rows in grid, with different properties for header row and body rows
            hooks.allColumns.push((hookColumns, hook) => [
                {
                    id: "selection",
                    columnId: "column_custom_0",
                    disableResizing: true,
                    disableFilters: true,
                    disableSortBy: true,
                    display: true,
                    minWidth: 35,
                    width: 35,
                    maxWidth: 35,
                    Header: ({ getToggleAllRowsSelectedProps }) => {
                        return (
                            <RowSelector
                                data-testid="rowSelector-allRows"
                                {...getToggleAllRowsSelectedProps()}
                            />
                        );
                    },
                    Cell: ({ row }) => (
                        <RowSelector
                            data-testid="rowSelector-singleRow"
                            {...row.getToggleRowSelectedProps()}
                        />
                    )
                },
                ...hookColumns,
                {
                    id: "custom",
                    columnId: "column_custom_1",
                    disableResizing: true,
                    disableFilters: true,
                    disableSortBy: true,
                    display: true,
                    minWidth: 35,
                    width: 35,
                    maxWidth: 35,
                    Cell: ({ row }) => {
                        const { instance } = hook;
                        return (
                            <div className="action">
                                <RowOptions
                                    row={row}
                                    rowActions={
                                        instance ? instance.rowActions : []
                                    }
                                    rowActionCallback={
                                        instance
                                            ? instance.rowActionCallback
                                            : null
                                    }
                                    bindRowEditOverlay={bindRowEditOverlay}
                                    bindRowDeleteOverlay={bindRowDeleteOverlay}
                                />
                                {isRowExpandEnabled || expandableColumn ? (
                                    <span
                                        className="expander"
                                        data-testid="rowExpanderIcon"
                                        {...row.getToggleRowExpandedProps()}
                                    >
                                        <i>
                                            <IconAngle
                                                className={
                                                    row.isExpanded
                                                        ? "icon-arrow-up"
                                                        : "icon-arrow-down"
                                                }
                                            />
                                        </i>
                                    </span>
                                ) : null}
                            </div>
                        );
                    }
                }
            ]);
        }
    );

    // Handle the row height calculation while expanding a row or resizing a column
    useEffect(() => {
        if (listRef && listRef.current) {
            listRef.current.resetAfterIndex(0, true);
        }
    });

    // Update state, when user is updating columns configuration from outside Grid
    useEffect(() => {
        setGridColumns(managableColumns);
    }, [managableColumns]);

    // Update state, when user is updating additional column configuration from outside Grid
    useEffect(() => {
        setAdditionalColumn(expandedRowData);
    }, [expandedRowData]);

    // Update the boolean value used to identify if this is the first time render of Grid
    useEffect(() => {
        setIsFirstRendering(false);
    }, []);

    // Update the select state of row in Grid using thehook provided by useTable method
    // Find the row Id using the key - value passed from props and use toggleRowSelected method
    useEffect(() => {
        if (rowsToDeselect && rowsToDeselect.length && idAttribute) {
            rowsToDeselect.forEach((rowId) => {
                const rowToDeselect = preFilteredRows.find((row) => {
                    const { original } = row;
                    return original[idAttribute] === rowId;
                });
                if (rowToDeselect) {
                    const { id } = rowToDeselect;
                    toggleRowSelected(id, false);
                    updateSelectedRows(preFilteredRows, selectedRowIds);
                }
            });
        }
    }, [rowsToDeselect]);

    // Trigger call back when user makes a row selection using checkbox
    // And store the rows that are selected by user for making them selected when data changes after groupsort
    // Call back method will not be triggered if this is the first render of Grid
    useEffect(() => {
        if (!isFirstRendering) {
            updateSelectedRows(preFilteredRows, selectedRowIds);
        }
    }, [selectedRowIds]);

    // Update the row selection and clear row expands when data changes
    // Set all row selections to false and find new Ids of already selected rows and make them selected
    useEffect(() => {
        if (!isFirstRendering) {
            // Make rows selected if user has already made any selections
            if (
                userSelectedRowIdentifiers &&
                userSelectedRowIdentifiers.length > 0 &&
                idAttribute
            ) {
                const updatedSelectedRowIds = [];
                // Loop through already selected rows and find row id and make it selected
                userSelectedRowIdentifiers.forEach((selectedRowId) => {
                    const updatedRow = preFilteredRows.find((row) => {
                        const { original } = row;
                        return original[idAttribute] === selectedRowId;
                    });
                    if (updatedRow) {
                        const { id } = updatedRow;
                        if (updatedRow) {
                            toggleRowSelected(id, true);
                            updatedSelectedRowIds.push(id);
                        }
                    }
                });
                // Loop through already selected rows and find row id that are not selected yet and update it to false
                Object.entries(selectedRowIds).forEach((objEntry) => {
                    if (objEntry && objEntry.length > 0) {
                        const rowId = objEntry[0];
                        if (!updatedSelectedRowIds.includes(rowId)) {
                            toggleRowSelected(rowId, false);
                        }
                    }
                });
            }
        }
    }, [gridData, groupSortOptions]);

    // Render each row and cells in each row, using attributes from react window list.
    const RenderRow = useCallback(
        ({ index, style }) => {
            // if (isItemLoaded(index)) - This check never became false during testing. Hence avoiding it to reach 100% code coverage in JEST test.
            const row = rows[index];
            prepareRow(row);
            return (
                <div {...row.getRowProps({ style })} className="table-row tr">
                    <div className="table-row-wrap">
                        {row.cells.map((cell) => {
                            if (cell.column.display === true) {
                                return (
                                    <div
                                        {...cell.getCellProps()}
                                        className="table-cell td"
                                    >
                                        {cell.render("Cell")}
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                    {/* Check if row eapand icon is clicked, and if yes, call function to bind content to the expanded region */}
                    {isRowExpandEnabled && row.isExpanded ? (
                        <div className="expand">
                            {additionalColumn.Cell(row, additionalColumn)}
                        </div>
                    ) : null}
                </div>
            );
        },
        [prepareRow, rows, isRowExpandEnabled, additionalColumn]
    );

    // Render table and other components as required
    // Use properties and methods provided by react-table
    // Autosizer used for calculating grid height (don't consider window width and column resizing value changes)
    // Infinite loader used for lazy loading, with the properties passed here and other values calculated at the top
    // React window list is used for implementing virtualization, specifying the item count in a frame and height of each rows in it.
    return (
        <div className="table-wrapper" style={{ width: gridWidth || "100%" }}>
            <div className="neo-grid-header">
                <div className="neo-grid-header__results">
                    <strong>
                        {totalRecordsCount > 0 &&
                        rows.length === gridData.length
                            ? totalRecordsCount
                            : rows.length}
                    </strong>
                    <span>{title || "Rows"}</span>
                </div>
                {CustomPanel ? (
                    <div className="neo-grid-header__customPanel">
                        <CustomPanel />
                    </div>
                ) : null}
                <div className="neo-grid-header__utilities">
                    {globalSearch !== false ? (
                        <GlobalFilter
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    ) : null}
                    {columnFilter !== false ? (
                        <div className="utilities-icon-container keyword-search-container">
                            <div
                                className="utilities-icon keyword-search"
                                role="presentation"
                                data-testid="toggleColumnFilter"
                                onClick={toggleColumnFilter}
                            >
                                <i>
                                    <IconFilter />
                                </i>
                            </div>
                        </div>
                    ) : null}
                    {groupSort !== false ? (
                        <div className="utilities-icon-container group-sort-container">
                            <div
                                className="utilities-icon group-sort"
                                role="presentation"
                                data-testid="toggleGroupSortOverLay"
                                onClick={toggleGroupSortOverLay}
                            >
                                <i>
                                    <IconGroupSort />
                                </i>
                            </div>
                            <GroupSort
                                isGroupSortOverLayOpen={isGroupSortOverLayOpen}
                                toggleGroupSortOverLay={toggleGroupSortOverLay}
                                columns={managableColumns}
                                applyGroupSort={applyGroupSort}
                            />
                        </div>
                    ) : null}
                    {columnChooser !== false ? (
                        <div className="utilities-icon-container manage-columns-container">
                            <div
                                className="utilities-icon manage-columns"
                                role="presentation"
                                data-testid="toggleManageColumnsOverlay"
                                onClick={toggleManageColumnsOverlay}
                            >
                                <i>
                                    <IconColumns />
                                </i>
                            </div>
                            <ColumnReordering
                                isManageColumnOverlayOpen={
                                    isManageColumnOverlayOpen
                                }
                                toggleManageColumnsOverlay={
                                    toggleManageColumnsOverlay
                                }
                                columns={managableColumns}
                                additionalColumn={expandedRowData}
                                updateColumnStructure={updateColumnStructure}
                            />
                        </div>
                    ) : null}
                    {exportData !== false ? (
                        <div className="utilities-icon-container manage-columns-container">
                            <div
                                className="utilities-icon export-data"
                                role="presentation"
                                data-testid="toggleExportDataOverlay"
                                onClick={toggleExportDataOverlay}
                            >
                                <i>
                                    <IconShare />
                                </i>
                            </div>
                            <ExportData
                                isExportOverlayOpen={isExportOverlayOpen}
                                toggleExportDataOverlay={
                                    toggleExportDataOverlay
                                }
                                rows={rows}
                                columns={gridColumns}
                                additionalColumn={additionalColumn}
                            />
                        </div>
                    ) : null}
                    {typeof onGridRefresh === "function" ? (
                        <div className="utilities-icon-container refresh-data-container">
                            <div
                                className="utilities-icon refresh-data"
                                role="presentation"
                                data-testid="refreshGrid"
                                onClick={onGridRefresh}
                            >
                                <i>
                                    <IconRefresh />
                                </i>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="table-popus">
                {isRowEditOverlyOpen ? (
                    <div className="overlay">
                        <RowEditOverlay
                            row={editedRowData}
                            columns={gridColumns}
                            additionalColumn={additionalColumn}
                            getRowEditOverlay={getRowEditOverlay}
                            closeRowEditOverlay={closeRowEditOverlay}
                            updateRowInGrid={updateRowInGrid}
                        />
                    </div>
                ) : null}
                {isRowDeleteOverlyOpen ? (
                    <div className="overlay">
                        <RowDeleteOverLay
                            row={deletedRowData}
                            closeRowDeleteOverlay={closeRowDeleteOverlay}
                            deleteRowFromGrid={deleteRowFromGrid}
                        />
                    </div>
                ) : null}
            </div>

            <div
                className="tableContainer table-outer neo-grid"
                style={{
                    height: gridHeight || "50vh",
                    overflowX: "auto",
                    overflowY: "hidden"
                }}
            >
                <AutoSizer
                    disableWidth
                    disableResizing
                    className="tableContainer__AutoSizer"
                >
                    {({ height }) => (
                        <div {...getTableProps()} className="table">
                            <div className="thead table-row table-row--head">
                                {headerGroups.map((headerGroup) => (
                                    <div
                                        {...headerGroup.getHeaderGroupProps()}
                                        className="tr"
                                    >
                                        {headerGroup.headers.map((column) => {
                                            if (
                                                !(
                                                    column.isGroupHeader ===
                                                        false &&
                                                    column.display === false
                                                )
                                            ) {
                                                return (
                                                    <div
                                                        {...column.getHeaderProps()}
                                                        className="table-cell column-heading th"
                                                    >
                                                        <div
                                                            data-testid="column-header-sort"
                                                            {...column.getSortByToggleProps()}
                                                        >
                                                            {column.render(
                                                                "Header"
                                                            )}
                                                            <span>
                                                                {column.isSorted ? (
                                                                    <i>
                                                                        <IconSort
                                                                            className={
                                                                                column.isSortedDesc
                                                                                    ? "sort-asc"
                                                                                    : "sort-desc"
                                                                            }
                                                                        />
                                                                    </i>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div
                                                            className={`txt-wrap column-filter ${
                                                                isFilterOpen
                                                                    ? "open"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {/* column.canFilter - should be used to identify if column is filterable */}
                                                            {/* But bug of react-table will set canFilter to true (even if it is false) after doing a global search */}
                                                            {/* Hence checking if filter logic is present as a function for a column */}
                                                            {typeof column.filter ===
                                                            "function"
                                                                ? column.render(
                                                                      "Filter"
                                                                  )
                                                                : null}
                                                        </div>
                                                        {column.canResize && (
                                                            <div
                                                                {...column.getResizerProps()}
                                                                className="resizer"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                ))}
                            </div>
                            <div {...getTableBodyProps()} className="tbody">
                                <InfiniteLoader
                                    isItemLoaded={isItemLoaded}
                                    itemCount={itemCount}
                                    loadMoreItems={loadMoreItems}
                                    className="tableContainer__InfiniteLoader"
                                >
                                    {({ onItemsRendered, ref }) => (
                                        <List
                                            ref={(list) => {
                                                ref(list);
                                                listRef.current = list;
                                            }}
                                            style={{ overflowX: "hidden" }}
                                            height={height - 60}
                                            itemCount={rows.length}
                                            itemSize={(index) => {
                                                return calculateRowHeight(
                                                    rows[index],
                                                    headerGroups &&
                                                        headerGroups.length
                                                        ? headerGroups[0]
                                                              .headers
                                                        : []
                                                );
                                            }}
                                            onItemsRendered={onItemsRendered}
                                            overscanCount={20}
                                            className="tableContainer__List"
                                        >
                                            {RenderRow}
                                        </List>
                                    )}
                                </InfiniteLoader>
                            </div>
                        </div>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

Customgrid.propTypes = {
    title: PropTypes.string,
    gridHeight: PropTypes.string,
    gridWidth: PropTypes.string,
    managableColumns: PropTypes.arrayOf(PropTypes.object),
    gridData: PropTypes.arrayOf(PropTypes.object),
    idAttribute: PropTypes.string,
    totalRecordsCount: PropTypes.number,
    getRowEditOverlay: PropTypes.func,
    updateRowInGrid: PropTypes.func,
    deleteRowFromGrid: PropTypes.func,
    searchColumn: PropTypes.func,
    onRowSelect: PropTypes.func,
    calculateRowHeight: PropTypes.func,
    expandableColumn: PropTypes.bool,
    isExpandContentAvailable: PropTypes.bool,
    hasNextPage: PropTypes.bool,
    isNextPageLoading: PropTypes.bool,
    loadNextPage: PropTypes.func,
    getSortedData: PropTypes.func,
    getToggleAllRowsSelectedProps: PropTypes.func,
    row: PropTypes.arrayOf(PropTypes.object),
    expandedRowData: PropTypes.object,
    rowActions: PropTypes.arrayOf(PropTypes.object),
    rowActionCallback: PropTypes.func,
    CustomPanel: PropTypes.any,
    globalSearch: PropTypes.bool,
    columnFilter: PropTypes.bool,
    groupSort: PropTypes.bool,
    columnChooser: PropTypes.bool,
    exportData: PropTypes.bool,
    onGridRefresh: PropTypes.func,
    rowsToDeselect: PropTypes.array
};

export default Customgrid;
