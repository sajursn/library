import React, { useContext } from "react";
import PropTypes from "prop-types";
import { AdditionalColumnContext } from "../Utilities/TagsContext";
import { checkInnerCells } from "../Utilities/TagUtilities";

const AdditionalColumnTag = (props) => {
    const contextVallues = useContext(AdditionalColumnContext);
    const { additionalColumn } = contextVallues;
    const { cellKey } = props;

    if (additionalColumn && additionalColumn.display === true && cellKey) {
        if (checkInnerCells(additionalColumn, cellKey)) {
            return (
                <React.Fragment key="AdditionalColumnFragment">
                    {props.children}
                </React.Fragment>
            );
        }
    }
    return null;
};

AdditionalColumnTag.propTypes = {
    cellKey: PropTypes.string,
    children: PropTypes.any
};

export default AdditionalColumnTag;
