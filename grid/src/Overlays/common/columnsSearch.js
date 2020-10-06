import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import update from "immutability-helper";

const ColumnSearch = ({
    columns,
    additionalColumn,
    managedColumns,
    managedAdditionalColumn,
    updateColumns
}) => {
    // Returns a single array that contains main columns as well as the expanded columns
    const getAllColumns = (columnsList, additionalColumnItem) => {
        let allCoulmns = [];
        if (columnsList && columnsList.length > 0) {
            allCoulmns = [...columnsList];
        }
        if (
            additionalColumnItem &&
            Object.keys(additionalColumnItem).length > 0 &&
            additionalColumnItem.innerCells &&
            additionalColumnItem.innerCells.length > 0
        ) {
            allCoulmns.push(additionalColumnItem);
        }
        return allCoulmns;
    };

    const [searchableColumns, setSearchableColumns] = useState(
        getAllColumns(columns, additionalColumn)
    );

    // Update searched columns state based on the searched value
    const onColumnSearch = (event) => {
        let { value } = event ? event.target : "";
        value = value ? value.toLowerCase() : "";
        const allColumns = getAllColumns(columns, additionalColumn);
        if (value !== "") {
            setSearchableColumns(
                allColumns.filter((column) => {
                    return column.Header.toLowerCase().includes(value);
                })
            );
        } else {
            setSearchableColumns(allColumns);
        }
    };

    // Check if the display value of column or all columns in managedColumns state is true/false
    const isSearchableColumnSelected = (columnId) => {
        const allManagedColumns = getAllColumns(
            managedColumns,
            managedAdditionalColumn
        );
        const filteredAllManagedColumns = allManagedColumns.filter((column) => {
            return column.display === true;
        });
        if (columnId === "all") {
            const allColumns = getAllColumns(columns, additionalColumn);
            return filteredAllManagedColumns.length === allColumns.length;
        }
        const selectedColumn = filteredAllManagedColumns.find((column) => {
            return column.columnId === columnId;
        });
        return selectedColumn !== null && selectedColumn !== undefined;
    };

    // update the display flag value of column or all columns in managedColumns state, based on the selection
    const onSearchableColumnChange = (event) => {
        if (event && event.currentTarget) {
            const { checked, dataset } = event.currentTarget;
            if (dataset) {
                const { columnid, isadditionalcolumn } = dataset;
                updateColumns(columnid, isadditionalcolumn, checked);
            }
        }
    };

    useEffect(() => {
        setSearchableColumns(
            update(searchableColumns, {
                $set: getAllColumns(columns, additionalColumn)
            })
        );
    }, [columns, additionalColumn]);

    return (
        <div className="columnSearch column__body">
            <input
                type="text"
                placeholder="Search column"
                className="custom__ctrl"
                data-testid="filterColumnsList"
                onChange={onColumnSearch}
            />
            <div className="column__selectAll">
                <div className="column__checkbox">
                    <div className="form-check">
                        <input
                            type="checkbox"
                            id="chk_selectAllSearchableColumns"
                            className="form-check-input custom-checkbox form-check-input"
                            data-testid="selectAllSearchableColumns"
                            data-columnid="all"
                            checked={isSearchableColumnSelected("all")}
                            onChange={onSearchableColumnChange}
                        />
                        <label
                            htmlFor="chk_selectAllSearchableColumns"
                            className="form-check-label column__selectTxt"
                        >
                            Select All
                        </label>
                    </div>
                </div>
            </div>
            {searchableColumns.map((column) => {
                const { columnId, Header, isDisplayInExpandedRegion } = column;
                return (
                    <div className="column__wrap" key={columnId}>
                        <div className="column__checkbox">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    id={`chk_selectSearchableColumn_${columnId}`}
                                    className="form-check-input custom-checkbox form-check-input"
                                    data-testid={`selectSingleSearchableColumn_${columnId}`}
                                    data-columnid={columnId}
                                    data-isadditionalcolumn={
                                        isDisplayInExpandedRegion
                                    }
                                    checked={isSearchableColumnSelected(
                                        columnId
                                    )}
                                    onChange={onSearchableColumnChange}
                                />
                                <label
                                    htmlFor={`chk_selectSearchableColumn_${columnId}`}
                                    className="form-check-label column__txt"
                                >
                                    {Header}
                                </label>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

ColumnSearch.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object,
    managedColumns: PropTypes.arrayOf(PropTypes.object),
    managedAdditionalColumn: PropTypes.object,
    updateColumns: PropTypes.func
};

export default ColumnSearch;
