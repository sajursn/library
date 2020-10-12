import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { withFormik, useFormikContext } from "formik";
import { IButton } from "@neo/button";
import { SaveLogo } from "../utilities/svgUtilities";
import "react-datepicker/dist/react-datepicker.css";
import FilterForm from "../component/filterForm";

const RightDrawer = (props) => {
    const { handleSubmit } = props;
    const { values, setFieldValue } = useFormikContext();
    const [applyFilterWarning, setApplyFilterWarning] = useState("");
    const [
        applyfilterWarningClassName,
        setApplyFilterWariningClassname
    ] = useState("");
    const [recentFilterShow, setRecentFilterShow] = useState("none");
    const [filterShow, setFilterShow] = useState("");
    const [showSavePopup, setShowSavePopup] = useState("none");
    const {
        emptyFilterWarning,
        emptyFilterClassName,
        filterShowProp,
        recentFilterShowProp,
        filterCount,
        filters,
        closeField,
        conditionHandler,
        applyValidator,
        resetDrawer,
        groupFilterCloseField,
        groupFilterConditionHandler,
        listViewClick,
        listView,
        listViewName,
        savedFilters,
        savedFilterName,
        savedFilterClick
    } = props;
    useEffect(() => {
        setApplyFilterWarning(emptyFilterWarning);
        setApplyFilterWariningClassname(emptyFilterClassName);
    }, [emptyFilterWarning, emptyFilterClassName]);

    useEffect(() => {
        if (listViewClick) {
            listView.predefinedFilters.forEach((list) => {
                if (list.name === listViewName) {
                    Object.entries(list.filters).forEach(
                        ([filterKeys, filterValues]) => {
                            setFieldValue(filterKeys, filterValues);
                            if (
                                list.filters[filterKeys].constructor ===
                                    Object &&
                                list.filters[filterKeys].condition
                            ) {
                                filters.forEach((filterItem) => {
                                    if (
                                        `${filterKeys}.value` ===
                                        filterItem.name
                                    ) {
                                        setFieldValue(
                                            `${filterItem.labelName},check`,
                                            true
                                        );
                                    }
                                });
                            }
                        }
                    );
                }
            });
        }
    }, [listViewClick]);

    useEffect(() => {
        if (savedFilterClick) {
            savedFilters.savedFilters.forEach((list) => {
                if (list.name === savedFilterName) {
                    Object.entries(list.filters).forEach(
                        ([filterKeys, filterValues]) => {
                            setFieldValue(filterKeys, filterValues);
                            if (
                                list.filters[filterKeys].constructor ===
                                    Object &&
                                list.filters[filterKeys].condition
                            ) {
                                filters.forEach((filterItem) => {
                                    if (
                                        `${filterKeys}.value` ===
                                        filterItem.name
                                    ) {
                                        setFieldValue(
                                            `${filterItem.labelName},check`,
                                            true
                                        );
                                    }
                                });
                            }
                        }
                    );
                }
            });
        }
    }, [savedFilterClick]);

    useEffect(() => {
        setRecentFilterShow(recentFilterShowProp);
        setFilterShow(filterShowProp);
    }, [recentFilterShowProp, filterShowProp]);

    /**
     * Method To open the save filter element from rightDrawer
     */
    const openSavePopup = () => {
        setShowSavePopup("");
    };

    /**
     * Method To close the save filter element from rightDrawer
     */
    const closeSavePopUp = () => {
        setShowSavePopup("none");
    };
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: recentFilterShow
                    }}
                    className="filter__content"
                >
                    <div className="filter__recentFilterTitle">
                        Recent Filters
                    </div>
                </div>

                <div
                    style={{
                        display: filterShow
                    }}
                >
                    <div className="filter__title">
                        Selected Filters
                        <span className="filter-count">{filterCount}</span>
                    </div>
                    <div className="filter__content">
                        <FilterForm
                            filters={filters}
                            closeField={closeField}
                            conditionHandler={conditionHandler}
                            groupFilterCloseField={groupFilterCloseField}
                            groupFilterConditionHandler={
                                groupFilterConditionHandler
                            }
                        />
                        <div className="filter__warning">
                            <span
                                id="fieldWarning"
                                className="text-danger"
                                style={{
                                    display: applyValidator
                                }}
                            >
                                No filter selected!
                            </span>
                        </div>
                    </div>
                    <div className="filter__btn">
                        <div className="filter__save">
                            <IButton
                                type="button"
                                className="button-save"
                                onClick={openSavePopup}
                            >
                                <SaveLogo />
                                <span>SAVE</span>
                            </IButton>
                        </div>
                        <div className="btn-wrap">
                            <span className={applyfilterWarningClassName}>
                                {applyFilterWarning}
                            </span>
                            <IButton
                                type="button"
                                data-testid="resetClick"
                                className="reset"
                                onClick={() => {
                                    resetDrawer(values, setFieldValue);
                                }}
                            >
                                Reset
                            </IButton>
                            <IButton
                                color="info"
                                type="submit"
                                className="applyFilter"
                                data-testid="applyFilter-button"
                            >
                                Apply Filter
                            </IButton>
                        </div>
                        <div
                            style={{
                                display: showSavePopup
                            }}
                            className="popup--save"
                        >
                            <h5>Save the Filter</h5>
                            <label htmlFor="saveFilterName">
                                Save Filter Name
                                <input
                                    id="saveFilterName"
                                    className="txt"
                                    data-testid="registersaveFilterName-input"
                                    onChange={() => {}}
                                />
                            </label>
                            <div className="btn-wrap">
                                <button
                                    type="button"
                                    className="button"
                                    data-testid="cancelSavePopup-button"
                                    onClick={() => {
                                        closeSavePopUp();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="button"
                                    data-testid="saveFilter-button"
                                    onClick={() => {
                                        closeSavePopUp();
                                    }}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

RightDrawer.propTypes = {
    emptyFilterWarning: PropTypes.any,
    emptyFilterClassName: PropTypes.any,
    recentFilterShowProp: PropTypes.any,
    filterShowProp: PropTypes.any,
    filterCount: PropTypes.any,
    resetDrawer: PropTypes.any,
    filters: PropTypes.any,
    closeField: PropTypes.any,
    conditionHandler: PropTypes.any,
    handleSubmit: PropTypes.any,
    applyValidator: PropTypes.any,
    groupFilterCloseField: PropTypes.any,
    groupFilterConditionHandler: PropTypes.any,
    listViewClick: PropTypes.any,
    listView: PropTypes.any,
    listViewName: PropTypes.any,
    savedFilters: PropTypes.any,
    savedFilterName: PropTypes.any,
    savedFilterClick: PropTypes.any
};

export default withFormik({
    displayName: "BasicForm",
    mapPropsToValues: (props) => props.initialValuesObject,
    validateOnBlur: false,
    validateOnChange: false,
    handleSubmit: (values, { props }) => {
        props.applyFilter(values);
    }
})(RightDrawer);
