import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    extractColumns,
    extractAdditionalColumn
} from "./Utilities/ColumnsUtilities";
import Customgrid from "./Customgrid";
// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./Styles/main.scss";

const Grid = (props) => {
    const {
        className,
        title,
        gridHeight,
        gridWidth,
        gridData,
        idAttribute,
        paginationType,
        pageInfo,
        loadMoreData,
        columns,
        columnToExpand,
        rowActions,
        rowActionCallback,
        getRowEditOverlay,
        onRowUpdate,
        onRowDelete,
        onRowSelect,
        calculateRowHeight,
        expandableColumn,
        CustomPanel,
        globalSearch,
        columnFilter,
        groupSort,
        columnChooser,
        exportData,
        onGridRefresh,
        rowsToDeselect
    } = props;

    // Check if device is desktop
    const isDesktop = window.innerWidth > 1024;

    // Set state value for variable to check if the loading process is going on
    const [isNextPageLoading, setIsNextPageLoading] = useState(false);
    // Local state for group sort options
    const [groupSortOptions, setGroupSortOptions] = useState([]);

    // Logic for searching in each column
    const searchColumn = (column, original, searchText) => {
        // Return value
        let isValuePresent = false;
        // Find the accessor node and inner cells array of each column
        const { accessor, innerCells } = column;
        // Find accessor value of a column
        const rowAccessorValue = original[accessor];
        // Check if inner cells are available and save value to boolean var
        const isInnerCellsPresent = innerCells && innerCells.length > 0;
        // Check if the column needs to be skipped from search
        if (column.isSearchable) {
            // Enter if cell value is object or array
            if (typeof rowAccessorValue === "object" && isInnerCellsPresent) {
                // Enter if cell value is array
                if (rowAccessorValue.length > 0) {
                    // Loop through cell array value and check if searched text is present
                    rowAccessorValue.forEach((value) => {
                        innerCells.forEach((cell) => {
                            const dataAccessor = value[cell.accessor];
                            const isSearchEnabled = cell.isSearchable;
                            if (
                                dataAccessor &&
                                isSearchEnabled &&
                                dataAccessor
                                    .toString()
                                    .toLowerCase()
                                    .includes(searchText)
                            ) {
                                isValuePresent = true;
                            }
                        });
                    });
                } else {
                    // If cell value is an object, loop through inner cells and check if searched text is present
                    innerCells.forEach((cell) => {
                        const dataAccessor = original[accessor][cell.accessor];
                        const isSearchEnabled = cell.isSearchable;
                        if (
                            dataAccessor &&
                            isSearchEnabled &&
                            dataAccessor
                                .toString()
                                .toLowerCase()
                                .includes(searchText)
                        ) {
                            isValuePresent = true;
                        }
                    });
                }
            } else {
                // If cell value is not an object or array, convert it to text and check if searched text is present
                const dataAccessor = original[accessor];
                if (
                    dataAccessor &&
                    dataAccessor.toString().toLowerCase().includes(searchText)
                ) {
                    isValuePresent = true;
                }
            }
        }
        return isValuePresent;
    };

    // Gets triggered when one row item is updated
    const updateRowInGrid = (original, updatedRow) => {
        if (onRowUpdate) {
            onRowUpdate(original, updatedRow);
        }
    };

    // Gets triggered when one row item is deleted
    const deleteRowFromGrid = (original) => {
        if (onRowDelete) {
            onRowDelete(original);
        }
    };

    // Extract/add and modify required data from user configured columns and expand columns
    const processedColumns = extractColumns(
        columns,
        searchColumn,
        isDesktop,
        updateRowInGrid,
        expandableColumn
    );
    const additionalColumn = extractAdditionalColumn(
        columnToExpand,
        isDesktop,
        updateRowInGrid
    );

    // Create columns variable, to be used by grid component
    const gridColumns = processedColumns || [];

    // Add logic to calculate height of each row, based on the content of  or more columns
    // This can be used only if developer using the component has not passed a function to calculate row height
    const calculateDefaultRowHeight = (row, columnsInGrid) => {
        // Minimum height for each row
        let rowHeight = 50;
        if (columnsInGrid && columnsInGrid.length > 0 && row) {
            // Get properties of a row
            const { original, isExpanded } = row;
            // Find the column with maximum width configured, from grid columns list
            const columnWithMaxWidth = [...columnsInGrid].sort((a, b) => {
                return b.width - a.width;
            })[0];
            // Get column properties including the user resized column width (totalFlexWidth)
            const { id, width, totalFlexWidth } = columnWithMaxWidth;
            // Get row value of that column
            const rowValue = original[id];
            if (rowValue) {
                // Find the length of text of data in that column
                const textLength = Object.values(rowValue).join(",").length;
                // This is a formula that was created for the test data used.
                rowHeight += Math.ceil((80 * textLength) / totalFlexWidth);
                const widthVariable =
                    totalFlexWidth > width
                        ? totalFlexWidth - width
                        : width - totalFlexWidth;
                rowHeight += widthVariable / 1000;
            }
            // Add logic to increase row height if row is expanded
            if (isExpanded && additionalColumn) {
                // Increase height based on the number of inner cells in additional columns
                rowHeight +=
                    additionalColumn.innerCells &&
                    additionalColumn.innerCells.length > 0
                        ? additionalColumn.innerCells.length * 35
                        : 35;
            }
        }
        return rowHeight;
    };

    // #region - Group sorting logic
    // Function to return sorting logic based on the user selected order of sort
    const compareValues = (compareOrder, v1, v2) => {
        let returnValue = 0;
        if (compareOrder === "Ascending") {
            if (v1 > v2) {
                returnValue = 1;
            } else if (v1 < v2) {
                returnValue = -1;
            }
            return returnValue;
        }
        if (v1 < v2) {
            returnValue = 1;
        } else if (v1 > v2) {
            returnValue = -1;
        }
        return returnValue;
    };
    // Function to return sorted data
    const getSortedData = (originalData) => {
        return originalData.sort((x, y) => {
            let compareResult = 0;
            groupSortOptions.forEach((option) => {
                const { sortBy, sortOn, order } = option;
                const newResult =
                    sortOn === "value"
                        ? compareValues(order, x[sortBy], y[sortBy])
                        : compareValues(
                              order,
                              x[sortBy][sortOn],
                              y[sortBy][sortOn]
                          );
                compareResult = compareResult || newResult;
            });
            return compareResult;
        });
    };
    // #endregion

    // Gets called when group sort is applied or cleared
    const doGroupSort = (sortOptions) => {
        setGroupSortOptions(sortOptions);
    };

    // Gets called when page scroll reaches the bottom of the grid.
    // Trigger call back and get the grid data updated.
    const loadNextPage = () => {
        const { lastPage, pageNum, pageSize, endCursor } = pageInfo;
        if (!lastPage) {
            setIsNextPageLoading(true);
            if (paginationType === "index") {
                loadMoreData({
                    pageNum: pageNum + 1,
                    pageSize
                });
            } else {
                loadMoreData({
                    endCursor,
                    pageSize
                });
            }
        }
    };

    useEffect(() => {
        setIsNextPageLoading(false);
    }, [gridData, pageInfo]);

    // Sort the data based on the user selected group sort optipons
    const data =
        gridData && gridData.length > 0 ? getSortedData([...gridData]) : [];

    if (!(data && data.length > 0)) {
        return (
            <div className={`grid-component-container ${className || ""}`}>
                <h2 style={{ textAlign: "center", marginTop: "70px" }}>
                    <span className="error">Invalid Data</span>
                </h2>
            </div>
        );
    }
    if (!(processedColumns && processedColumns.length > 0)) {
        return (
            <div className={`grid-component-container ${className || ""}`}>
                <h2 style={{ textAlign: "center", marginTop: "70px" }}>
                    <span className="error">Invalid Column Configuration</span>
                </h2>
            </div>
        );
    }
    if (!idAttribute) {
        return (
            <div className={`grid-component-container ${className || ""}`}>
                <h2 style={{ textAlign: "center", marginTop: "70px" }}>
                    <span className="error">Id Attribute not passed</span>
                </h2>
            </div>
        );
    }

    const { total, lastPage } = pageInfo;
    return (
        <div className={`grid-component-container ${className || ""}`}>
            <Customgrid
                title={title}
                gridHeight={gridHeight}
                gridWidth={gridWidth}
                managableColumns={gridColumns}
                expandedRowData={additionalColumn}
                data={data}
                idAttribute={idAttribute}
                totalRecordsCount={total}
                getRowEditOverlay={getRowEditOverlay}
                updateRowInGrid={updateRowInGrid}
                deleteRowFromGrid={deleteRowFromGrid}
                searchColumn={searchColumn}
                onRowSelect={onRowSelect}
                calculateRowHeight={
                    calculateRowHeight &&
                    typeof calculateRowHeight === "function"
                        ? calculateRowHeight
                        : calculateDefaultRowHeight
                }
                expandableColumn={expandableColumn}
                rowActions={rowActions}
                rowActionCallback={rowActionCallback}
                hasNextPage={!lastPage}
                isNextPageLoading={isNextPageLoading}
                loadNextPage={loadNextPage}
                doGroupSort={doGroupSort}
                CustomPanel={CustomPanel}
                globalSearch={globalSearch}
                columnFilter={columnFilter}
                groupSort={groupSort}
                columnChooser={columnChooser}
                exportData={exportData}
                onGridRefresh={onGridRefresh}
                rowsToDeselect={rowsToDeselect}
            />
            {isNextPageLoading ? (
                <div id="loader" className="background">
                    <div className="dots container">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

Grid.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    gridHeight: PropTypes.string,
    gridWidth: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.object),
    columnToExpand: PropTypes.object,
    gridData: PropTypes.arrayOf(PropTypes.object),
    idAttribute: PropTypes.string,
    paginationType: PropTypes.string,
    pageInfo: PropTypes.object,
    loadMoreData: PropTypes.func,
    getRowEditOverlay: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
    onRowSelect: PropTypes.func,
    calculateRowHeight: PropTypes.func,
    expandableColumn: PropTypes.bool,
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

export default Grid;
