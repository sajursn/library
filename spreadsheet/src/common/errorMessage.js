import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { SEARCH_NOT_FOUNT_ERROR } from "./errorConstants";
import { IconClose } from "../utilities/svgUtilities";

const ErrorMessage = (props) => {
    const { status, closeWarningStatus, clearSearchValue } = props;
    const [errorStatus, setStatus] = useState(status);
    useEffect(() => {
        setStatus(status);
    }, [status]);
    if (errorStatus === "invalid") {
        return (
            <div id="errorMsg">
                <div className="alert alert-danger" role="alert">
                    {SEARCH_NOT_FOUNT_ERROR}
                </div>
                <div
                    role="presentation"
                    className="notification-close"
                    onClick={() => {
                        closeWarningStatus();
                        clearSearchValue();
                    }}
                >
                    <i>
                        <IconClose />
                    </i>
                </div>
            </div>
        );
    }
    return <div />;
};

ErrorMessage.propTypes = {
    status: PropTypes.any,
    closeWarningStatus: PropTypes.func,
    clearSearchValue: PropTypes.any
};

export default ErrorMessage;
