import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import CellDisplayAndEditTag from "./CellDisplayAndEditTag";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import { IconPencil, IconTick, IconCancel } from "../Utilities/SvgUtilities";

const CellDisplayAndEdit = ({ row, updateRowInGrid, expandableColumn }) => {
    const { column, columns } = row;
    if (column && row.row) {
        const { original, isExpanded } = row.row;
        const [isEditOpen, setIsEditOpen] = useState(false);
        const [editedRowValue, setEditedRowValue] = useState(null);

        const { id } = column;

        const closeEdit = () => {
            setIsEditOpen(false);
        };

        const openEdit = () => {
            setIsEditOpen(true);
        };

        const getUpdatedRowValue = (value) => {
            if (value) {
                setEditedRowValue(value);
            }
        };

        const saveEdit = () => {
            if (editedRowValue) {
                updateRowInGrid(original, editedRowValue);
            }
            closeEdit();
        };

        const originalRowValue = { ...original };
        const cellDisplayContent = column.displayCell(
            originalRowValue,
            CellDisplayAndEditTag,
            expandableColumn ? isExpanded : null
        );
        const cellEditContent = column.editCell
            ? column.editCell(
                  originalRowValue,
                  CellDisplayAndEditTag,
                  getUpdatedRowValue
              )
            : null;
        const columnsToPass = columns;
        const columnToPass = column;

        return (
            <CellDisplayAndEditContext.Provider
                value={{ columns: columnsToPass, column: columnToPass }}
            >
                <ClickAwayListener
                    onClickAway={closeEdit}
                    className={`table-cell--content table-cell--content__${id}`}
                >
                    {cellEditContent ? (
                        <div
                            className="cell-edit"
                            role="presentation"
                            onClick={openEdit}
                        >
                            <i>
                                <IconPencil />
                            </i>
                        </div>
                    ) : null}
                    {cellDisplayContent}
                    {isEditOpen ? (
                        <div className="table-cell--content-edit">
                            {cellEditContent}
                            <button
                                type="button"
                                aria-label="Cell Edit Save Button"
                                className="neo-btn neo-btn-primary btn btn-secondary"
                                data-testid="cell-edit-save"
                                onClick={saveEdit}
                            >
                                <IconTick />
                            </button>
                            <button
                                type="button"
                                aria-label="Cell Edit Cancel Button"
                                className="neo-btn neo-btn-default btn btn-secondary"
                                data-testid="cell-edit-cancel"
                                onClick={closeEdit}
                            >
                                <IconCancel />
                            </button>
                        </div>
                    ) : null}
                </ClickAwayListener>
            </CellDisplayAndEditContext.Provider>
        );
    }
    return null;
};

CellDisplayAndEdit.propTypes = {
    row: PropTypes.object,
    updateRowInGrid: PropTypes.func,
    expandableColumn: PropTypes.bool
};

export default CellDisplayAndEdit;
