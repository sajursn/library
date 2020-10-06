import React, { useContext } from "react";
import PropTypes from "prop-types";
import { CellDisplayAndEditContext } from "../Utilities/TagsContext";
import { checkInnerCells } from "../Utilities/TagUtilities";

const CellDisplayAndEditTag = (props) => {
    const contextVallues = useContext(CellDisplayAndEditContext);
    const { column, columns } = contextVallues;
    const { cellKey, columnKey } = props;

    if (columns && columnKey) {
        const selectedColumn = columns.find(
            (col) => col.id === columnKey && col.display === true
        );
        if (checkInnerCells(selectedColumn, cellKey)) {
            return (
                <React.Fragment key="CellDisplayAndEditFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    } else if (column.display === true && cellKey) {
        if (checkInnerCells(column, cellKey)) {
            return (
                <React.Fragment key="CellDisplayAndEditFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    }
    return null;
};

CellDisplayAndEditTag.propTypes = {
    cellKey: PropTypes.string,
    columnKey: PropTypes.string,
    children: PropTypes.any
};

export default CellDisplayAndEditTag;
