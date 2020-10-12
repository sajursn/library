import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import update from "immutability-helper";
import ColumnSearch from "../common/columnsSearch";
import ColumnsList from "./columnsList";
import { IconClose } from "../../Utilities/SvgUtilities";

const ColumnReordering = (props) => {
    const {
        isManageColumnOverlayOpen,
        toggleManageColumnsOverlay,
        columns,
        additionalColumn,
        updateColumnStructure
    } = props;

    // D&D code
    const HTML5toTouch = {
        backends: [
            {
                backend: HTML5Backend
            },
            {
                backend: TouchBackend,
                options: { enableMouseEvents: true },
                preview: true,
                transition: TouchTransition
            }
        ]
    };

    // Check if additional Column is present or not
    const isAdditionalColumnPresent =
        additionalColumn &&
        Object.keys(additionalColumn).length > 0 &&
        additionalColumn.innerCells &&
        additionalColumn.innerCells.length > 0;

    // Set state variables for:
    // managedColumns - main columns displayed in colum setting region
    // managedAdditionalColumn - additional column displayed in colum setting region
    // isErrorDisplayed - to see if error message has to be displayed or not
    const [managedColumns, setManagedColumns] = useState([...columns]);
    const [managedAdditionalColumn, setManagedAdditionalColumn] = useState(
        isAdditionalColumnPresent ? { ...additionalColumn } : null
    );
    const [isErrorDisplayed, setIsErrorDisplayed] = useState(false);

    // #region - Column chooser region

    // Updates the column display value accordingly
    const changeColumnSelection = (column, flag) => {
        return update(column, {
            display: { $set: flag }
        });
    };

    // update the display flag value of column or all columns in managedColumns state, based on the selection
    const updateColumns = (columnid, isadditionalcolumn, checked) => {
        if (columnid === "all") {
            // Update both main columns and additional column state values
            const updatedManagedColumns = managedColumns.map((column) => {
                return changeColumnSelection(column, checked);
            });
            setManagedColumns(
                update(updatedManagedColumns, {
                    $set: updatedManagedColumns
                })
            );
            if (isAdditionalColumnPresent) {
                setManagedAdditionalColumn(
                    changeColumnSelection(managedAdditionalColumn, checked)
                );
            }
        } else if (isAdditionalColumnPresent && isadditionalcolumn === "true") {
            // Update additional column state value
            setManagedAdditionalColumn(
                changeColumnSelection(managedAdditionalColumn, checked)
            );
        } else {
            // Update main columns state value
            const indexOfColumn = managedColumns.findIndex((column) => {
                return column.columnId === columnid;
            });
            setManagedColumns(
                update(managedColumns, {
                    [indexOfColumn]: {
                        $set: changeColumnSelection(
                            managedColumns[indexOfColumn],
                            checked
                        )
                    }
                })
            );
        }
    };

    // #endregion

    // #region - Column settings region

    // Updates the order of columns in managedColumns state
    const onColumnReorder = (reorderedColumns) => {
        setManagedColumns(
            update(managedColumns, {
                $set: reorderedColumns
            })
        );
    };

    // Updates the inner cell display value accordingly
    const changeInnerCellSelection = (innerCells, cellid, flag) => {
        const indexOfCell = innerCells.findIndex((cell) => {
            return cell.cellId === cellid;
        });
        return update(innerCells, {
            [indexOfCell]: {
                $set: update(innerCells[indexOfCell], {
                    display: { $set: flag }
                })
            }
        });
    };

    // Update the display flag value of inner cell in managedColumns state, based on the selection
    const onInnerCellChange = (event) => {
        if (event && event.currentTarget) {
            const { checked, dataset } = event.currentTarget;
            if (dataset) {
                const { columnid, cellid, isadditionalcolumn } = dataset;
                if (isadditionalcolumn === "false") {
                    setManagedColumns(() => {
                        return [...managedColumns].map((column) => {
                            const updatedColumn = { ...column };
                            const { columnId, innerCells } = updatedColumn;
                            if (
                                columnId === columnid &&
                                innerCells &&
                                innerCells.length > 0
                            ) {
                                updatedColumn.innerCells = [...innerCells].map(
                                    (cell) => {
                                        const updatedCell = { ...cell };
                                        const { cellId } = updatedCell;
                                        if (cellId === cellid) {
                                            updatedCell.display = checked;
                                        }
                                        return updatedCell;
                                    }
                                );
                            }
                            return updatedColumn;
                        });
                    });
                } else if (
                    isAdditionalColumnPresent &&
                    managedAdditionalColumn &&
                    managedAdditionalColumn.innerCells &&
                    managedAdditionalColumn.innerCells.length > 0
                ) {
                    setManagedAdditionalColumn(
                        update(managedAdditionalColumn, {
                            innerCells: {
                                $set: changeInnerCellSelection(
                                    managedAdditionalColumn.innerCells,
                                    cellid,
                                    checked
                                )
                            }
                        })
                    );
                }
            }
        }
    };

    // #endregion

    const resetColumnUpdate = () => {
        const columnsToReset = [...columns].map((col) => {
            const colToReset = col;
            colToReset.display = true;
            if (colToReset.innerCells && colToReset.innerCells.length > 0) {
                const innerCellsToReset = [...colToReset.innerCells].map(
                    (cell) => {
                        const cellToReset = cell;
                        cellToReset.display = true;
                        return cellToReset;
                    }
                );
                colToReset.innerCells = innerCellsToReset;
            }
            return colToReset;
        });
        setManagedColumns(
            update(managedColumns, {
                $set: columnsToReset
            })
        );
        const additionalColumnToReset = { ...additionalColumn };
        additionalColumnToReset.display = true;
        if (
            additionalColumnToReset.innerCells &&
            additionalColumnToReset.innerCells.length > 0
        ) {
            const additionalInnerCellsToReset = [
                ...additionalColumnToReset.innerCells
            ].map((cell) => {
                const additionalCellToReset = cell;
                additionalCellToReset.display = true;
                return additionalCellToReset;
            });
            additionalColumnToReset.innerCells = additionalInnerCellsToReset;
        }
        setManagedAdditionalColumn(
            update(managedAdditionalColumn, {
                $set: additionalColumnToReset
            })
        );
        updateColumnStructure(columnsToReset, additionalColumnToReset);
    };

    const onColumnChooserSave = () => {
        setIsErrorDisplayed(false);
        const filteredManagedColumns = managedColumns.filter((column) => {
            return column.display === true;
        });
        if (filteredManagedColumns && filteredManagedColumns.length > 0) {
            updateColumnStructure(managedColumns, managedAdditionalColumn);
            toggleManageColumnsOverlay();
        } else {
            setIsErrorDisplayed(true);
        }
    };

    useEffect(() => {
        setManagedColumns([...columns]);
    }, [columns]);

    useEffect(() => {
        setManagedAdditionalColumn(
            isAdditionalColumnPresent ? { ...additionalColumn } : null
        );
    }, [additionalColumn]);

    if (isManageColumnOverlayOpen) {
        const isAdditionalColumnSelected =
            managedAdditionalColumn !== null &&
            managedAdditionalColumn.innerCells &&
            managedAdditionalColumn.innerCells.length > 0 &&
            managedAdditionalColumn.display === true;
        const additionalColumnHeader = isAdditionalColumnPresent
            ? additionalColumn.Header
            : "";
        const managedAdditionalColumnInnercells = isAdditionalColumnSelected
            ? managedAdditionalColumn.innerCells
            : [];
        const managedAdditionalColumnColumnId = isAdditionalColumnSelected
            ? managedAdditionalColumn.columnId
            : "";
        const managedAdditionalColumnDisplayType = isAdditionalColumnSelected
            ? managedAdditionalColumn.isDisplayInExpandedRegion
            : "true";

        return (
            <ClickAwayListener
                onClickAway={toggleManageColumnsOverlay}
                className="neo-grid-popover neo-grid-popover--column columns--grid"
            >
                <div className="neo-grid-popover__column column__grid">
                    <div className="column__chooser">
                        <div className="column__header">
                            <strong>Column Chooser</strong>
                        </div>
                        <ColumnSearch
                            columns={[...columns]}
                            additionalColumn={additionalColumn}
                            managedColumns={managedColumns}
                            managedAdditionalColumn={managedAdditionalColumn}
                            updateColumns={updateColumns}
                        />
                    </div>
                    <div className="column__settings">
                        <div className="column__header">
                            <div className="column__headerTxt">
                                <strong>Column Settings</strong>
                                {isErrorDisplayed ? (
                                    <strong className="column-warning">
                                        Select at least one column
                                        {isAdditionalColumnPresent
                                            ? `(other than
                                        ${additionalColumnHeader})`
                                            : null}
                                    </strong>
                                ) : null}
                            </div>
                            <div
                                className="column__close"
                                role="presentation"
                                onClick={toggleManageColumnsOverlay}
                            >
                                <i>
                                    <IconClose />
                                </i>
                            </div>
                        </div>
                        <div className="column__body">
                            <DndProvider
                                backend={MultiBackend}
                                options={HTML5toTouch}
                            >
                                <ColumnsList
                                    managedColumns={managedColumns}
                                    onColumnReorder={onColumnReorder}
                                    onInnerCellChange={onInnerCellChange}
                                />
                            </DndProvider>
                            {isAdditionalColumnSelected ? (
                                <div className="column__reorder full-width">
                                    <div className="column__reorder__Header">
                                        {additionalColumnHeader}
                                    </div>
                                    <div className="column__innerCells__wrap">
                                        {managedAdditionalColumnInnercells.length >
                                        0
                                            ? managedAdditionalColumnInnercells.map(
                                                  (cell) => {
                                                      const {
                                                          cellId,
                                                          Header,
                                                          display
                                                      } = cell;
                                                      return (
                                                          <div
                                                              className="column__wrap"
                                                              key={`${cellId}`}
                                                          >
                                                              <div className="column__checkbox">
                                                                  <div className="form-check">
                                                                      <input
                                                                          type="checkbox"
                                                                          id={`chk_selectInnerCell_${cellId}`}
                                                                          className="form-check-input custom-checkbox form-check-input"
                                                                          data-testid={`selectInnerCell_${managedAdditionalColumnColumnId}_${cellId}`}
                                                                          data-columnid={
                                                                              managedAdditionalColumnColumnId
                                                                          }
                                                                          data-cellid={
                                                                              cellId
                                                                          }
                                                                          data-isadditionalcolumn={
                                                                              managedAdditionalColumnDisplayType
                                                                          }
                                                                          checked={
                                                                              display
                                                                          }
                                                                          onChange={
                                                                              onInnerCellChange
                                                                          }
                                                                      />
                                                                      <label
                                                                          htmlFor={`chk_selectInnerCell_${cellId}`}
                                                                          className="form-check-label"
                                                                      >
                                                                          {
                                                                              Header
                                                                          }
                                                                      </label>
                                                                  </div>
                                                              </div>
                                                          </div>
                                                      );
                                                  }
                                              )
                                            : null}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                        <div className="column__footer">
                            <div className="column__btns">
                                <button
                                    type="button"
                                    className="neo-btn neo-btn-default btn btn-secondary"
                                    data-testid="reset_columnsManage"
                                    onClick={resetColumnUpdate}
                                >
                                    Reset
                                </button>
                                <button
                                    type="button"
                                    className="neo-btn neo-btn-default btn btn-secondary"
                                    data-testid="cancel_columnsManage"
                                    onClick={toggleManageColumnsOverlay}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="neo-btn neo-btn-primary btn btn-secondary"
                                    data-testid="save_columnsManage"
                                    onClick={onColumnChooserSave}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
    return null;
};

ColumnReordering.propTypes = {
    isManageColumnOverlayOpen: PropTypes.bool,
    toggleManageColumnsOverlay: PropTypes.func,
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object,
    updateColumnStructure: PropTypes.func
};

export default ColumnReordering;
