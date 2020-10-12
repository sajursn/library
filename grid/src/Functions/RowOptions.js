import React, { useState } from "react";
import ClickAwayListener from "react-click-away-listener";
import PropTypes from "prop-types";
import { RowDelete, RowEdit, IconCancel } from "../Utilities/SvgUtilities";

const RowOptions = ({
    row,
    rowActions,
    rowActionCallback,
    bindRowEditOverlay,
    bindRowDeleteOverlay
}) => {
    const isRowActionsAvailable = rowActions && rowActions.length > 0;

    if (isRowActionsAvailable) {
        const { original } = row;

        // Check if Edit row option is required or not
        const editOptionIndex = rowActions.findIndex((action) => {
            return action.label.toLowerCase() === "edit";
        });
        const isRowEditOptionNeeded = editOptionIndex > -1;

        // Check if Delete row option is required or not
        const deleteOptionIndex = rowActions.findIndex((action) => {
            return action.label.toLowerCase() === "delete";
        });
        const isRowDeleteOptionNeeded = deleteOptionIndex > -1;

        // Find the additional row actions required
        const additionalRowOptions = rowActions.filter((action) => {
            return (
                action.label.toLowerCase() !== "edit" &&
                action.label.toLowerCase() !== "delete"
            );
        });

        const isAdditionalRowOptionsPresent =
            additionalRowOptions &&
            additionalRowOptions.length > 0 &&
            typeof rowActionCallback === "function";

        const [isRowOptionsOpen, setRowOptionsOpen] = useState(false);

        const openRowOptionsOverlay = () => {
            setRowOptionsOpen(true);
        };

        const closeRowOptionsOverlay = () => {
            setRowOptionsOpen(false);
        };

        const openRowEditOverlay = () => {
            bindRowEditOverlay(original);
            closeRowOptionsOverlay();
        };

        const openDeleteOverlay = () => {
            bindRowDeleteOverlay(original);
            closeRowOptionsOverlay();
        };

        const additionalActionClicked = (actionValue) => {
            closeRowOptionsOverlay();
            return rowActionCallback(original, actionValue);
        };

        return (
            <div className="row-options-wrap">
                <span
                    className="icon-row-options"
                    data-testid="rowActions-open-link"
                    role="presentation"
                    onClick={openRowOptionsOverlay}
                >
                    <i />
                    <i />
                    <i />
                </span>
                {isRowOptionsOpen ? (
                    <ClickAwayListener
                        onClickAway={closeRowOptionsOverlay}
                        className="row-options-overlay"
                        data-testid="rowActions-kebab-overlay"
                    >
                        <ul>
                            {isRowEditOptionNeeded ? (
                                <li>
                                    <span
                                        data-testid="rowAction-editRow"
                                        role="presentation"
                                        onClick={openRowEditOverlay}
                                    >
                                        <i>
                                            <RowEdit />
                                        </i>
                                        <span>Edit</span>
                                    </span>
                                </li>
                            ) : null}
                            {isRowDeleteOptionNeeded ? (
                                <li>
                                    <span
                                        data-testid="rowAction-deleteRow"
                                        role="presentation"
                                        onClick={openDeleteOverlay}
                                    >
                                        <i>
                                            <RowDelete />
                                        </i>
                                        <span>Delete</span>
                                    </span>
                                </li>
                            ) : null}
                            {isAdditionalRowOptionsPresent
                                ? additionalRowOptions.map((action) => {
                                      const { value, label } = action;
                                      return (
                                          <li key={value}>
                                              <span
                                                  data-testid="rowAction-additionalAction"
                                                  role="presentation"
                                                  onClick={() => {
                                                      return additionalActionClicked(
                                                          value
                                                      );
                                                  }}
                                              >
                                                  <i className="default" />
                                                  <span>{label}</span>
                                              </span>
                                          </li>
                                      );
                                  })
                                : null}
                        </ul>
                        <span
                            role="presentation"
                            className="close"
                            onClick={closeRowOptionsOverlay}
                        >
                            <i>
                                <IconCancel />
                            </i>
                        </span>
                    </ClickAwayListener>
                ) : null}
            </div>
        );
    }
    return null;
};
RowOptions.propTypes = {
    row: PropTypes.object,
    rowActions: PropTypes.arrayOf(PropTypes.object),
    rowActionCallback: PropTypes.func,
    bindRowEditOverlay: PropTypes.func,
    bindRowDeleteOverlay: PropTypes.func
};

export default RowOptions;
