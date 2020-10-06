import React from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";

const RowDeleteOverLay = ({
    row,
    closeRowDeleteOverlay,
    deleteRowFromGrid
}) => {
    const deleteRow = () => {
        if (row) {
            deleteRowFromGrid(row);
        }
        closeRowDeleteOverlay();
    };

    return (
        <ClickAwayListener
            className="row-option-action-overlay delete"
            data-testid="rowDeleteOverlay-container"
            onClickAway={closeRowDeleteOverlay}
        >
            <div className="btn-wrap">
                <button
                    type="button"
                    className="neo-btn neo-btn-primary btn btn-secondary"
                    data-testid="rowDeleteOverlay-Delete"
                    onClick={deleteRow}
                >
                    Delete
                </button>
                <button
                    type="button"
                    className="neo-btn neo-btn-default btn btn-secondary"
                    data-testid="rowDeleteOverlay-cancel"
                    onClick={closeRowDeleteOverlay}
                >
                    Cancel
                </button>
            </div>
        </ClickAwayListener>
    );
};
RowDeleteOverLay.propTypes = {
    row: PropTypes.object,
    closeRowDeleteOverlay: PropTypes.func,
    deleteRowFromGrid: PropTypes.func
};

export default RowDeleteOverLay;
