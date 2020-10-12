import React, { useContext } from "react";
import PropTypes from "prop-types";
import { RowEditContext } from "../Utilities/TagsContext";
import { findSelectedColumn, checkInnerCells } from "../Utilities/TagUtilities";

const RowEditTag = (props) => {
    const contextVallues = useContext(RowEditContext);
    const { columns, additionalColumn } = contextVallues;
    const { cellKey, columnKey } = props;

    if (columns && columnKey) {
        const selectedColumn = findSelectedColumn(columns, columnKey);
        if (selectedColumn && !selectedColumn.innerCells) {
            return (
                <React.Fragment key="RowEditFragment">
                    {props.children}
                </React.Fragment>
            );
        }
        if (selectedColumn && cellKey) {
            if (checkInnerCells(selectedColumn, cellKey)) {
                return (
                    <React.Fragment key="RowEditFragment">
                        {props.children}
                    </React.Fragment>
                );
            }
        } else if (
            !selectedColumn &&
            additionalColumn &&
            additionalColumn.display === true
        ) {
            if (checkInnerCells(additionalColumn, columnKey)) {
                return (
                    <React.Fragment key="RowEditFragment">
                        {props.children}
                    </React.Fragment>
                );
            }
        }
    }
    return null;
};

RowEditTag.propTypes = {
    cellKey: PropTypes.string,
    columnKey: PropTypes.string,
    children: PropTypes.any
};

export default RowEditTag;
