import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import { RowEditContext } from "../Utilities/TagsContext";
import RowEditTag from "./RowEditTag";

const RowEditOverLay = ({
    row,
    columns,
    additionalColumn,
    getRowEditOverlay,
    closeRowEditOverlay,
    updateRowInGrid
}) => {
    const [editedRowValue, setEditedRowValue] = useState(null);

    const getUpdatedRowValue = (value) => {
        if (value) {
            setEditedRowValue(value);
        }
    };

    const saveRowEdit = () => {
        if (editedRowValue) {
            updateRowInGrid(row, editedRowValue);
        }
        closeRowEditOverlay();
    };

    const originalRowValue = { ...row };
    const rowEditContent = getRowEditOverlay(
        originalRowValue,
        RowEditTag,
        getUpdatedRowValue
    );
    return (
        <RowEditContext.Provider
            value={{
                columns,
                additionalColumn
            }}
        >
            <ClickAwayListener
                className="row-option-action-overlay"
                data-testid="rowEditOverlay-container"
                onClickAway={closeRowEditOverlay}
            >
                {rowEditContent}
                <div className="btn-wrap">
                    <button
                        type="button"
                        className="neo-btn neo-btn-primary btn btn-secondary"
                        data-testid="rowEditOverlay-save"
                        onClick={saveRowEdit}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="neo-btn neo-btn-default btn btn-secondary"
                        data-testid="rowEditOverlay-cancel"
                        onClick={closeRowEditOverlay}
                    >
                        Cancel
                    </button>
                </div>
            </ClickAwayListener>
        </RowEditContext.Provider>
    );
};
RowEditOverLay.propTypes = {
    row: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.object),
    additionalColumn: PropTypes.object,
    getRowEditOverlay: PropTypes.func,
    closeRowEditOverlay: PropTypes.func,
    updateRowInGrid: PropTypes.func
};

export default RowEditOverLay;
