import React, { memo } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";

const RowDeleteOverLay = memo(
    ({ row, closeRowDeleteOverlay, deleteRowFromGrid }) => {
        const deleteRow = () => {
            if (row) {
                deleteRowFromGrid(row);
            }
            closeRowDeleteOverlay();
        };

        return (
            <ClickAwayListener onClickAway={closeRowDeleteOverlay}>
                <div className="row-option-action-overlay delete">
                    <div className="cancel-save-buttons-delete">
                        <button
                            type="button"
                            className="delete-Button"
                            onClick={deleteRow}
                        >
                            Delete
                        </button>
                        <button
                            type="button"
                            className="cancel-Button"
                            onClick={closeRowDeleteOverlay}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
);

RowDeleteOverLay.propTypes = {
    row: PropTypes.any,
    closeRowDeleteOverlay: PropTypes.any,
    deleteRowFromGrid: PropTypes.any
};

export default RowDeleteOverLay;
