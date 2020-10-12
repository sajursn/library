import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import OutsideClickHandler from "react-outside-click-handler";
import RightDrawer from "./drawer/rightDrawer";
import LeftDrawer from "./drawer/leftDrawer";
import MainFilterPanel from "./panel/mainFilterPanel";

// eslint-disable-next-line import/no-unresolved
import "!style-loader!css-loader!sass-loader!./styles/main.scss";

let filter = [];
let initialValueObject = {};
export default function Filter(props) {
    const [leftPopUpShow, setLeftShowPopup] = useState(false);
    const [showApplyFilter, setApplyFilter] = useState(false);
    const [applyFilterChip, setApplyFilterChip] = useState({});
    const [filterCount, setFilterCount] = useState(0);
    const [filterData, setFilterData] = useState({});
    const [emptyFilterWarning, setEmptyFilterWarning] = useState("");
    const [emptyFilterClassName, setEmptyFilterClassName] = useState("");
    const [recentFilterShow, setRecentFilterShow] = useState("none");
    const [filterShow, setFilterShow] = useState("");
    const [initialValuesObject, setInitialValuesObject] = useState({});
    const [applyValidator, setApplyFilterValidator] = useState("none");
    const [filters, setFilters] = useState([]);
    const [listViewClick, setListViewClick] = useState(false);
    const [listViewName, setListViewName] = useState("");
    const [savedFilterClick, setSavedFilterClick] = useState(false);
    const [savedFilterName, setSavedFilterName] = useState("");
    const [loaded, setLoad] = useState(false);
    const {
        filterDataProp,
        appliedFiltersProp,
        CustomPanel,
        listView,
        savedFilters,
        oneTimeValues
    } = props;

    useEffect(() => {
        setFilters(filter);
    }, [filter]);
    useEffect(() => {
        setInitialValuesObject(initialValueObject);
    }, [initialValueObject]);
    useEffect(() => {
        setFilterData(filterDataProp);
    }, [filterDataProp]);
    useEffect(() => {
        let count = 0;
        count = filters.length;
        setFilterCount(count);

        if (count > 0) {
            setApplyFilterValidator("none");
        }
    }, [filters]);

    /**
     * Method to display left Popup
     */

    const closeLeftPopUp = () => {
        if (leftPopUpShow === true) setLeftShowPopup(false);
    };

    /**
     * Method set the state which shows the drawer when on true condition
     */
    const showDrawer = () => {
        setApplyFilter(true);
    };

    const handlelistViewClick = (list) => {
        setListViewName(list.name);
        setSavedFilterName("");
        setListViewClick(true);
        setInitialValuesObject({});
        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");
        filter = [...filters];
        const filterTemp = [];
        const initialValueTemp = {};
        setApplyFilterChip(list.filters);
        Object.entries(list.filters).forEach(([key, values]) => {
            const filterDataTemp = filterDataProp;
            filterDataTemp.filter.forEach((jsonFilter) => {
                if (
                    key === jsonFilter.name &&
                    !jsonFilter.isSubFilter &&
                    !jsonFilter.isGroupFilter
                ) {
                    let tempProp;
                    if (jsonFilter.props !== undefined) {
                        tempProp = jsonFilter.props;
                    } else tempProp = {};
                    if (jsonFilter.oneTimeCode) {
                        Object.entries(oneTimeValues).forEach(([keys]) => {
                            if (jsonFilter.oneTimeCode === keys) {
                                tempProp.options = oneTimeValues[keys];
                            }
                        });
                    }
                    const jsonFilterTemp = jsonFilter;
                    jsonFilterTemp.weight = 700;

                    if (values.condition) {
                        filterTemp.push({
                            labelName: `${jsonFilter.label}`,
                            label: jsonFilter.label,
                            name: `${jsonFilter.name}.value`,
                            isSubFilter: jsonFilter.isSubFilter,
                            dataType: jsonFilter.dataType,
                            condition: jsonFilter.condition,
                            isRequired: jsonFilter.isRequired,
                            initialValue: jsonFilter.initialValue,
                            display: "",
                            disabled: false,
                            validationDisplay: "none",
                            props: tempProp,
                            conditionFieldName: `${jsonFilter.name}.condition`
                        });
                    } else {
                        filterTemp.push({
                            labelName: `${jsonFilter.label}`,
                            label: jsonFilter.label,
                            name: jsonFilter.name,
                            isSubFilter: jsonFilter.isSubFilter,
                            dataType: jsonFilter.dataType,
                            condition: jsonFilter.condition,
                            isRequired: jsonFilter.isRequired,
                            initialValue: jsonFilter.initialValue,
                            display: "none",
                            disabled: true,
                            validationDisplay: "none",
                            props: tempProp
                        });
                    }

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            initialValueObject,
                            jsonFilter.name
                        )
                    ) {
                        if (
                            jsonFilter.dataType === "IFlightNumber" ||
                            jsonFilter.dataType === "MasterSelect"
                        ) {
                            initialValueTemp[jsonFilter.name] = [];
                        } else {
                            initialValueTemp[jsonFilter.name] = "";
                        }
                    }
                }

                if (jsonFilter.isSubFilter) {
                    jsonFilter.subFilters.forEach((subFilter) => {
                        if (key === subFilter.name) {
                            const jsonFilterTemp = jsonFilter;
                            jsonFilterTemp.weight = 700;
                            let tempProp;
                            if (subFilter.props !== undefined) {
                                tempProp = subFilter.props;
                            } else tempProp = {};
                            if (jsonFilter.oneTimeCode) {
                                Object.entries(oneTimeValues).forEach(
                                    ([keys]) => {
                                        if (subFilter.oneTimeCode === keys) {
                                            tempProp.options =
                                                oneTimeValues[keys];
                                        }
                                    }
                                );
                            }
                            if (list.filters[key].condition) {
                                filterTemp.push({
                                    labelName: `${jsonFilter.label}${subFilter.label}`,
                                    label: jsonFilter.label,
                                    name: `${subFilter.name}.value`,
                                    isSubFilter: jsonFilter.isSubFilter,
                                    type: subFilter.label,
                                    dataType: subFilter.dataType,
                                    condition: subFilter.condition,
                                    isRequired: subFilter.isRequired,
                                    initialValue: subFilter.initialValue,
                                    display: "",
                                    disabled: false,
                                    validationDisplay: "none",
                                    props: tempProp,
                                    conditionFieldName: `${subFilter.name}.condition`
                                });
                            } else {
                                filterTemp.push({
                                    labelName: `${jsonFilter.label}${subFilter.label}`,
                                    label: jsonFilter.label,
                                    name: subFilter.name,
                                    isSubFilter: jsonFilter.isSubFilter,
                                    type: subFilter.label,
                                    dataType: subFilter.dataType,
                                    condition: subFilter.condition,
                                    isRequired: subFilter.isRequired,
                                    initialValue: subFilter.initialValue,
                                    display: "none",
                                    disabled: true,
                                    validationDisplay: "none",
                                    props: tempProp
                                });
                            }

                            if (
                                !Object.prototype.hasOwnProperty.call(
                                    initialValueObject,
                                    subFilter.name
                                )
                            ) {
                                if (
                                    subFilter.dataType === "IFlightNumber" ||
                                    subFilter.dataType === "MasterSelect"
                                ) {
                                    initialValueTemp[subFilter.name] = [];
                                } else {
                                    initialValueTemp[subFilter.name] = "";
                                }
                            }
                        }

                        if (subFilter.isGroupFilter) {
                            subFilter.groupFilter.forEach((groupFilters) => {
                                if (key === groupFilters.name) {
                                    const jsonFilterTemp = jsonFilter;
                                    jsonFilterTemp.weight = 700;
                                    const index = filterTemp.findIndex(
                                        (x) => x.label === subFilter.label
                                    );
                                    if (index === -1) {
                                        if (list.filters[key].condition) {
                                            filterTemp.push({
                                                display: "",
                                                disabled: false,
                                                validationDisplay: "none",
                                                label: subFilter.label,
                                                isSubFilter:
                                                    subFilter.isSubFilter,
                                                isGroupFilter:
                                                    subFilter.isGroupFilter,
                                                groupFilter:
                                                    subFilter.groupFilter,
                                                condition: subFilter.condition
                                            });
                                        } else {
                                            filterTemp.push({
                                                display: "none",
                                                disabled: true,
                                                validationDisplay: "none",
                                                label: subFilter.label,
                                                isSubFilter:
                                                    subFilter.isSubFilter,
                                                isGroupFilter:
                                                    subFilter.isGroupFilter,
                                                groupFilter:
                                                    subFilter.groupFilter,
                                                condition: subFilter.condition
                                            });
                                        }
                                    }
                                    subFilter.groupFilter.forEach(
                                        (groupedFilter) => {
                                            if (
                                                !Object.prototype.hasOwnProperty.call(
                                                    initialValueObject,
                                                    groupedFilter.name
                                                )
                                            ) {
                                                if (
                                                    groupedFilter.dataType ===
                                                        "IFlightNumber" ||
                                                    groupedFilter.dataType ===
                                                        "MasterSelect"
                                                ) {
                                                    initialValueObject[
                                                        groupedFilter.name
                                                    ] = [];
                                                } else {
                                                    initialValueObject[
                                                        groupedFilter.name
                                                    ] = "";
                                                }
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
                if (jsonFilter.isGroupFilter) {
                    jsonFilter.groupFilter.forEach((groupFilters) => {
                        if (key === groupFilters.name) {
                            const jsonFilterTemp = jsonFilter;
                            jsonFilterTemp.weight = 700;
                            const index = filterTemp.findIndex(
                                (x) => x.label === jsonFilter.label
                            );
                            if (index === -1) {
                                if (list.filters[key].condition) {
                                    filterTemp.push({
                                        display: "",
                                        disabled: false,
                                        validationDisplay: "none",
                                        label: jsonFilter.label,
                                        isSubFilter: jsonFilter.isSubFilter,
                                        isGroupFilter: jsonFilter.isGroupFilter,
                                        groupFilter: jsonFilter.groupFilter,
                                        condition: jsonFilter.condition
                                    });
                                } else {
                                    filterTemp.push({
                                        display: "none",
                                        disabled: true,
                                        validationDisplay: "none",
                                        label: jsonFilter.label,
                                        isSubFilter: jsonFilter.isSubFilter,
                                        isGroupFilter: jsonFilter.isGroupFilter,
                                        groupFilter: jsonFilter.groupFilter,
                                        condition: jsonFilter.condition
                                    });
                                }
                            }

                            jsonFilter.groupFilter.forEach((groupedFilter) => {
                                if (
                                    !Object.prototype.hasOwnProperty.call(
                                        initialValueObject,
                                        groupedFilter.name
                                    )
                                ) {
                                    if (
                                        groupedFilter.dataType ===
                                            "IFlightNumber" ||
                                        groupedFilter.dataType ===
                                            "MasterSelect"
                                    ) {
                                        initialValueObject[
                                            groupedFilter.name
                                        ] = [];
                                    } else {
                                        initialValueObject[groupedFilter.name] =
                                            "";
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
        filter = [...filterTemp];
        initialValueObject = {
            ...initialValueTemp
        };
        if (filter.length > 0) {
            closeLeftPopUp();
        }
    };
    useEffect(() => {
        if (!loaded) {
            listView.predefinedFilters.forEach((list) => {
                if (list.default === true) {
                    handlelistViewClick(list);
                }
            });
            setLoad(true);
        }
    }, [loaded]);

    /**
     * Method set the state which closes the drawer when the state is in false condition
     */
    const closeDrawer = () => {
        setApplyFilter(false);
    };

    /**
     * Method to check whether atleast a filter is being selected
     */

    const applyFilterValidation = () => {
        if (filterCount === 0) {
            setApplyFilterValidator("");
            setApplyFilter(true);
        } else {
            closeDrawer();
        }
    };

    /**
     * Method which creates the array which contains the elements to be shown in the applied filter chips
     * @param {*} appliedFilters is the filter changes to be applied
     */

    const applyFilter = (appliedFilters) => {
        setApplyFilterChip(appliedFilters);
        applyFilterValidation();

        initialValueObject = {
            ...initialValuesObject
        };
        Object.entries(appliedFilters).forEach(([key, value]) => {
            initialValueObject[key] = value;
        });
        setInitialValuesObject(initialValueObject);
        const applied = {};
        Object.entries(appliedFilters).forEach(([key, values]) => {
            if (
                !values.condition &&
                (((typeof values === "string" || Array.isArray(values)) &&
                    values.length > 0) ||
                    (values &&
                        values.constructor === Object &&
                        Object.keys(values).length > 0) ||
                    (typeof values === "boolean" && !key.includes(",check")))
            ) {
                applied[key] = values;
            } else if (
                (values.condition && values.condition.length > 0) ||
                ((typeof values.value === "string" ||
                    Array.isArray(values.value)) &&
                    values.value.length > 0) ||
                (typeof values.value === "object" &&
                    !Array.isArray(values.value) &&
                    Object.keys(values.value).length > 0) ||
                (typeof values.value === "boolean" && !key.includes(",check"))
            ) {
                applied[key] = values;
            }
        });
        if (Object.keys(applied).length > 0) {
            appliedFiltersProp(applied);
        }
    };

    /**
     * Method To prevent listView rerendering */
    const completeListViewClick = () => {
        setListViewClick(false);
    };

    /**
     * Method To prevent savedFilter rerendering */
    const completeSavedFilterClick = () => {
        setSavedFilterClick(false);
    };

    /**
     * Method To reset the right drawer
     * @param {*} values is the formik  field values
     * @param {*} setFieldValue is the formik method to change the field values
     */
    const resetDrawer = (values, setFieldValue) => {
        setApplyFilterChip({});
        setRecentFilterShow("");
        setFilterShow("none");
        const filterDatas = {
            ...filterData
        };
        filterDatas.filter.forEach((filte) => {
            const weigh = filte;
            weigh.weight = 400;
            if (filte.isSubFilter) {
                filte.subFilters.forEach((item) => {
                    const fontweigh = item;
                    fontweigh.weight = 400;
                });
            }
        });
        setFilterData(filterDatas);
        setFilters([]);
        Object.keys(initialValuesObject).forEach((item) => {
            setFieldValue(item, "");
        });
        Object.keys(values).forEach((item) => {
            setFieldValue(item, "");
        });
        completeListViewClick();
        completeSavedFilterClick();
        setListViewName("");
    };

    /**
     * Method To create the filter field arrays for filters under a accordion grouping
     * @param {*} label is the label of the filter field
     * @param {*} isSubFilter is a boolean check for whether the subFilters are there or not
     * @param {*} type is the name of the filter field
     * @param {*} dataType is the dataType of the filter field
     * @param {*} condition is the condition array of the filter field if present
     * @param {*} isRequired is the required of the filter field
     * @param {*} name is the name of the filter field
     * @param {*} initialValue is the initialValue of the filter field
     *  @param {*} prop is the prop of the filter field
     * @param {*} oneTimeCode is the prop of the filter field
     */
    const accordionFiltersFromLeftToRight = (
        label,
        isSubFilter,
        type,
        dataType,
        condition,
        isRequired,
        name,
        initialValue,
        prop,
        oneTimeCode
    ) => {
        let tempProp;
        if (prop !== undefined) {
            tempProp = prop;
        } else tempProp = {};

        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");
        filter = [...filters];
        filterData.filter.forEach((item) => {
            const itemParam = item;
            if (item.label === label) {
                itemParam.weight = 700;
                item.subFilters.forEach((tip) => {
                    const tipParam = tip;
                    if (tip.label === type) {
                        tipParam.weight = 600;
                    }
                });
            }
        });
        if (filter.length > 0) {
            const index = filter.findIndex(
                (x) => x.label === label && x.type === type
            );
            if (index === -1) {
                if (oneTimeCode) {
                    Object.entries(oneTimeValues).forEach(([key]) => {
                        if (oneTimeCode === key) {
                            tempProp.options = oneTimeValues[key];
                        }
                    });
                }
                filter.unshift({
                    labelName: `${label}${type}`,
                    label,
                    name,
                    isSubFilter,
                    type,
                    dataType,
                    condition,
                    isRequired,
                    initialValue,
                    display: "none",
                    disabled: true,
                    validationDisplay: "none",
                    props: tempProp
                });
            }
        } else {
            if (oneTimeCode) {
                Object.entries(oneTimeValues).forEach(([key]) => {
                    if (oneTimeCode === key) {
                        tempProp.options = oneTimeValues[key];
                    }
                });
            }
            filter.unshift({
                labelName: `${label}${type}`,
                label,
                name,
                isSubFilter,
                type,
                dataType,
                condition,
                isRequired,
                initialValue,
                display: "none",
                disabled: true,
                validationDisplay: "none",
                props: tempProp
            });
        }
        initialValueObject = {
            ...initialValuesObject
        };
        filter.forEach((items) => {
            if (name === items.name) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        initialValueObject,
                        items.name
                    )
                ) {
                    if (
                        items.dataType === "IFlightNumber" ||
                        items.dataType === "MasterSelect"
                    ) {
                        initialValueObject[items.name] = [];
                    } else {
                        initialValueObject[items.name] = "";
                    }
                }
            }
        });
        setInitialValuesObject(initialValueObject);
    };

    /**
     * Method To create the filter field arrays for each individual filter type
     * @param {*} label is the label of the filter field
     * @param {*} isSubFilter is a boolean check for whether the subFilters are there or not
     * @param {*} dataType is the dataType of the filter field
     * @param {*} condition is the condition array of the filter field if present
     * @param {*} isRequired is the required of the filter field
     * @param {*} name is the name of the filter field
     * @param {*} initialValue is the initialValue of the filter field
     * @param {*} prop is the props of the filter field
     * @param {*} oneTimeCode is the props of the filter field
     */
    const individualFiltersfromLeftToRight = (
        label,
        isSubFilter,
        dataType,
        condition,
        isRequired,
        name,
        initialValue,
        prop,
        oneTimeCode
    ) => {
        let tempProp;
        if (prop !== undefined) {
            tempProp = prop;
        } else tempProp = {};

        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");

        const filterDataTemp = filterData;
        filterDataTemp.filter.forEach((item) => {
            const itemParam = item;
            if (item.label === label) {
                itemParam.weight = 700;
            }
        });
        filter = [...filters];
        if (filter.length > 0) {
            const index = filter.findIndex((x) => x.label === label);
            if (index === -1) {
                if (oneTimeCode) {
                    Object.entries(oneTimeValues).forEach(([key]) => {
                        if (oneTimeCode === key) {
                            tempProp.options = oneTimeValues[key];
                        }
                    });
                }
                filter.unshift({
                    labelName: `${label}`,
                    label,
                    name,
                    isSubFilter,
                    dataType,
                    condition,
                    isRequired,
                    initialValue,
                    display: "none",
                    disabled: true,
                    validationDisplay: "none",
                    props: tempProp
                });
            }
        } else {
            if (oneTimeCode) {
                Object.entries(oneTimeValues).forEach(([key]) => {
                    if (oneTimeCode === key) {
                        tempProp.options = oneTimeValues[key];
                    }
                });
            }
            filter.unshift({
                labelName: `${label}`,
                label,
                name,
                isSubFilter,
                dataType,
                condition,
                isRequired,
                initialValue,
                display: "none",
                disabled: true,
                validationDisplay: "none",
                props: tempProp
            });
        }
        initialValueObject = {
            ...initialValuesObject
        };
        filter.forEach((items) => {
            if (name === items.name) {
                if (
                    !Object.prototype.hasOwnProperty.call(
                        initialValueObject,
                        items.name
                    )
                ) {
                    if (
                        items.dataType === "IFlightNumber" ||
                        items.dataType === "MasterSelect"
                    ) {
                        initialValueObject[items.name] = [];
                    } else {
                        initialValueObject[items.name] = "";
                    }
                }
            }
        });
        setInitialValuesObject(initialValueObject);
    };
    /**
     * Method To create the filter field arrays for groupFilters
     *  @param {*} item is the groupFilter
     */
    const groupFiltersFromLeftToRight = (item) => {
        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");

        filterData.filter.forEach((field) => {
            const fieldParam = field;
            if (item.label === fieldParam.label) {
                fieldParam.weight = 700;
            }
        });

        filter = [...filters];

        if (filter.length > 0) {
            const index = filter.findIndex((x) => x.label === item.label);
            if (index === -1) {
                filter.unshift({
                    display: "none",
                    disabled: true,
                    validationDisplay: "none",
                    label: item.label,
                    isSubFilter: item.isSubFilter,
                    isGroupFilter: item.isGroupFilter,
                    groupFilter: item.groupFilter,
                    condition: item.condition
                });
            }
        } else {
            filter.unshift({
                display: "none",
                disabled: true,
                validationDisplay: "none",
                label: item.label,
                isSubFilter: item.isSubFilter,
                isGroupFilter: item.isGroupFilter,
                groupFilter: item.groupFilter,
                condition: item.condition
            });
        }
        initialValueObject = {
            ...initialValuesObject
        };
        filter.forEach((items) => {
            if (item.label === items.label) {
                item.groupFilter.forEach((groupedFilter) => {
                    if (
                        !Object.prototype.hasOwnProperty.call(
                            initialValueObject,
                            groupedFilter.name
                        )
                    ) {
                        if (
                            groupedFilter.dataType === "IFlightNumber" ||
                            groupedFilter.dataType === "MasterSelect"
                        ) {
                            initialValueObject[groupedFilter.name] = [];
                        } else {
                            initialValueObject[groupedFilter.name] = "";
                        }
                    }
                });
            }
        });
        setInitialValuesObject(initialValueObject);
    };

    /**
     * Method To close the filter element from rightDrawer
     * @param {*} item is the specific filter element object
     *  @param {*} setFieldValue is formik call back function to set the field Values
     */
    const closeField = (item, setFieldValue) => {
        filter = [...filters];
        const index = filter.findIndex((it) => it.name === item.name);
        if (index !== -1) {
            filterData.filter.forEach((it) => {
                const itParam = it;
                if (it.name === item.name) itParam.weight = 400;
            });
            if (item.isSubFilter) {
                filterData.filter.forEach((its) => {
                    if (its.label === item.label) {
                        its.subFilters.forEach((ite) => {
                            const iteParam = ite;
                            if (ite.label === item.type) {
                                iteParam.weight = 400;
                            }
                        });
                    }
                });
            }
            filter.splice(index, 1);
        }
        setFieldValue(item.name, "");
        setFilters(filter);
    };
    /**
     * Method To handle filter conditional field in rightDrawer
     * @param {*} item is the specific filter element object
     * @param {*} values is formik values
     * @param {*} setFieldValue is the method to set formik values
     */
    const conditionHandler = (item, values, setFieldValue) => {
        filter = [...filters];
        filter.forEach((it) => {
            const itParam = it;
            if (it.name === item.name) {
                if (it.disabled === false) {
                    itParam.disabled = true;
                } else {
                    itParam.disabled = false;
                }
                if (it.display === "none") {
                    itParam.display = "";
                } else {
                    itParam.display = "none";
                }
            }
        });
        if (item.disabled === true) {
            const itemParam = item;
            delete itemParam.conditionFieldName;
            filter.forEach((filterItem) => {
                if (filterItem.name === item.name) {
                    Object.assign(filterItem, {
                        name: filterItem.name.replace(".value", "")
                    });
                }
            });
            Object.entries(values).forEach(([key, value]) => {
                if (key === item.name) {
                    const tempValues = values;
                    const tempValue = value.value;
                    delete tempValues[key];
                    setFieldValue(item.name, tempValue);
                }
            });
        }

        if (item.disabled === false) {
            filter.forEach((filterItem) => {
                if (filterItem.name === item.name) {
                    Object.assign(filterItem, {
                        conditionFieldName: `${item.name}.condition`,
                        name: `${item.name}.value`
                    });
                }
            });

            Object.entries(values).forEach(([key, value]) => {
                if (`${key}.value` === item.name) {
                    const tempObject = {};
                    Object.assign(tempObject, {
                        condition: "",
                        value
                    });
                    setFieldValue(key, tempObject);
                }
            });
        }
    };

    /**
     * Method To close the groupfilter element from rightDrawer
     * @param {*} quanta is the specific groupfilter element object
     */
    const groupFilterCloseField = (quanta) => {
        const index = filters.findIndex((it) => it.label === quanta.label);
        if (index !== -1) {
            filterData.filter.forEach((it) => {
                const itParam = it;
                if (it.label === quanta.label) itParam.weight = 400;
            });
        }
        filter = [...filters];
        filter.splice(index, 1);
        setFilters(filter);
    };
    /**
     * Method To handle groupfilter conditional field in rightDrawer
     * @param {*} item is the specific groupfilter element object
     *  @param {*} values is formik values
     * @param {*} setFieldValue is the method to set formik values
     */
    const groupFilterConditionHandler = (item, values, setFieldValue) => {
        filter = [...filters];
        filter.forEach((it) => {
            if (it.label === item.label) {
                const itParam = it;
                if (it.disabled === false) {
                    itParam.disabled = true;
                } else {
                    itParam.disabled = false;
                }
                if (it.display === "none") {
                    itParam.display = "";
                } else {
                    itParam.display = "none";
                }
            }
        });
        if (item.disabled === true) {
            const itemParam = item;
            delete itemParam.conditionFieldName;
            filter.forEach((filterItem) => {
                if (filterItem.label === item.label) {
                    filterItem.groupFilter.forEach((groupFilterItem) => {
                        Object.assign(groupFilterItem, {
                            name: groupFilterItem.name.replace(".value", "")
                        });
                    });
                }
            });
            Object.entries(values).forEach(([key, value]) => {
                item.groupFilter.forEach((groupFilterItem) => {
                    if (key === groupFilterItem.name) {
                        const tempValues = values;
                        const tempValue = value.value;
                        delete tempValues[key];
                        setFieldValue(groupFilterItem.name, tempValue);
                    }
                });
            });
        }

        if (item.disabled === false) {
            filter.forEach((filterItem) => {
                if (filterItem.label === item.label) {
                    Object.assign(item, {
                        conditionFieldName: `${item.label}.condition`
                    });
                    filterItem.groupFilter.forEach((groupFilterItem) => {
                        Object.assign(groupFilterItem, {
                            name: `${groupFilterItem.name}.value`
                        });
                    });
                }
            });

            Object.entries(values).forEach(([key, value]) => {
                item.groupFilter.forEach((groupFilterItem) => {
                    if (`${key}.value` === groupFilterItem.name) {
                        const tempObject = {};
                        Object.assign(tempObject, {
                            value
                        });
                        setFieldValue(key, tempObject);
                    }
                });
            });
        }
    };

    /**
     * Method to display left Popup
     */
    const openLeftPopUp = () => {
        if (leftPopUpShow === false) setLeftShowPopup(true);
    };

    const handleSavedFilterClick = (list) => {
        setRecentFilterShow("none");
        setFilterShow("");
        setEmptyFilterClassName("");
        setEmptyFilterWarning("");
        setSavedFilterName(list.name);
        setListViewName("");
        setSavedFilterClick(true);
        const filterTemp = [];
        const initialValueTemp = {};
        setApplyFilterChip(list.filters);
        Object.entries(list.filters).forEach(([key]) => {
            filterData.filter.forEach((jsonFilter) => {
                if (
                    key === jsonFilter.name &&
                    !jsonFilter.isSubFilter &&
                    !jsonFilter.isGroupFilter
                ) {
                    let tempProp;
                    if (jsonFilter.props !== undefined) {
                        tempProp = jsonFilter.props;
                    } else tempProp = {};
                    if (jsonFilter.oneTimeCode) {
                        Object.entries(oneTimeValues).forEach(([keys]) => {
                            if (jsonFilter.oneTimeCode === keys) {
                                tempProp.options = oneTimeValues[keys];
                            }
                        });
                    }
                    const jsonFilterTemp = jsonFilter;
                    jsonFilterTemp.weight = 700;
                    if (list.filters[key].condition) {
                        filterTemp.push({
                            labelName: `${jsonFilter.label}`,
                            label: jsonFilter.label,
                            name: `${jsonFilter.name}.value`,
                            isSubFilter: jsonFilter.isSubFilter,
                            dataType: jsonFilter.dataType,
                            condition: jsonFilter.condition,
                            isRequired: jsonFilter.isRequired,
                            initialValue: jsonFilter.initialValue,
                            display: "",
                            disabled: false,
                            validationDisplay: "none",
                            props: tempProp,
                            conditionFieldName: `${jsonFilter.name}.condition`
                        });
                    } else {
                        filterTemp.push({
                            labelName: `${jsonFilter.label}`,
                            label: jsonFilter.label,
                            name: jsonFilter.name,
                            isSubFilter: jsonFilter.isSubFilter,
                            dataType: jsonFilter.dataType,
                            condition: jsonFilter.condition,
                            isRequired: jsonFilter.isRequired,
                            initialValue: jsonFilter.initialValue,
                            display: "none",
                            disabled: true,
                            validationDisplay: "none",
                            props: tempProp
                        });
                    }

                    if (
                        !Object.prototype.hasOwnProperty.call(
                            initialValueObject,
                            jsonFilter.name
                        )
                    ) {
                        if (
                            jsonFilter.dataType === "IFlightNumber" ||
                            jsonFilter.dataType === "MasterSelect"
                        ) {
                            initialValueTemp[jsonFilter.name] = [];
                        } else {
                            initialValueTemp[jsonFilter.name] = "";
                        }
                    }
                }

                if (jsonFilter.isSubFilter) {
                    jsonFilter.subFilters.forEach((subFilter) => {
                        if (key === subFilter.name) {
                            const jsonFilterTemp = jsonFilter;
                            jsonFilterTemp.weight = 700;
                            let tempProp;
                            if (subFilter.props !== undefined) {
                                tempProp = subFilter.props;
                            } else tempProp = {};
                            if (subFilter.oneTimeCode) {
                                Object.entries(oneTimeValues).forEach(
                                    ([keys]) => {
                                        if (subFilter.oneTimeCode === keys) {
                                            tempProp.options =
                                                oneTimeValues[keys];
                                        }
                                    }
                                );
                            }
                            if (list.filters[key].condition) {
                                filterTemp.push({
                                    labelName: `${jsonFilter.label}${subFilter.label}`,
                                    label: jsonFilter.label,
                                    name: `${subFilter.name}.value`,
                                    isSubFilter: jsonFilter.isSubFilter,
                                    type: subFilter.label,
                                    dataType: subFilter.dataType,
                                    condition: subFilter.condition,
                                    isRequired: subFilter.isRequired,
                                    initialValue: subFilter.initialValue,
                                    display: "",
                                    disabled: false,
                                    validationDisplay: "none",
                                    props: tempProp,
                                    conditionFieldName: `${subFilter.name}.condition`
                                });
                            } else {
                                filterTemp.push({
                                    labelName: `${jsonFilter.label}${subFilter.label}`,
                                    label: jsonFilter.label,
                                    name: subFilter.name,
                                    isSubFilter: jsonFilter.isSubFilter,
                                    type: subFilter.label,
                                    dataType: subFilter.dataType,
                                    condition: subFilter.condition,
                                    isRequired: subFilter.isRequired,
                                    initialValue: subFilter.initialValue,
                                    display: "none",
                                    disabled: true,
                                    validationDisplay: "none",
                                    props: tempProp
                                });
                            }

                            if (
                                !Object.prototype.hasOwnProperty.call(
                                    initialValueObject,
                                    subFilter.name
                                )
                            ) {
                                if (
                                    subFilter.dataType === "IFlightNumber" ||
                                    subFilter.dataType === "MasterSelect"
                                ) {
                                    initialValueTemp[subFilter.name] = [];
                                } else {
                                    initialValueTemp[subFilter.name] = "";
                                }
                            }
                        }

                        if (subFilter.isGroupFilter) {
                            subFilter.groupFilter.forEach((groupFilters) => {
                                if (key === groupFilters.name) {
                                    const jsonFilterTemp = jsonFilter;
                                    jsonFilterTemp.weight = 700;
                                    const index = filterTemp.findIndex(
                                        (x) => x.label === subFilter.label
                                    );
                                    if (index === -1) {
                                        if (list.filters[key].condition) {
                                            filterTemp.push({
                                                display: "",
                                                disabled: false,
                                                validationDisplay: "none",
                                                label: subFilter.label,
                                                isSubFilter:
                                                    subFilter.isSubFilter,
                                                isGroupFilter:
                                                    subFilter.isGroupFilter,
                                                groupFilter:
                                                    subFilter.groupFilter,
                                                condition: subFilter.condition
                                            });
                                        } else {
                                            filterTemp.push({
                                                display: "none",
                                                disabled: true,
                                                validationDisplay: "none",
                                                label: subFilter.label,
                                                isSubFilter:
                                                    subFilter.isSubFilter,
                                                isGroupFilter:
                                                    subFilter.isGroupFilter,
                                                groupFilter:
                                                    subFilter.groupFilter,
                                                condition: subFilter.condition
                                            });
                                        }
                                    }

                                    subFilter.groupFilter.forEach(
                                        (groupedFilter) => {
                                            if (
                                                !Object.prototype.hasOwnProperty.call(
                                                    initialValueObject,
                                                    groupedFilter.name
                                                )
                                            ) {
                                                if (
                                                    groupedFilter.dataType ===
                                                        "IFlightNumber" ||
                                                    groupedFilter.dataType ===
                                                        "MasterSelect"
                                                ) {
                                                    initialValueObject[
                                                        groupedFilter.name
                                                    ] = [];
                                                } else {
                                                    initialValueObject[
                                                        groupedFilter.name
                                                    ] = "";
                                                }
                                            }
                                        }
                                    );
                                }
                            });
                        }
                    });
                }
                if (jsonFilter.isGroupFilter) {
                    jsonFilter.groupFilter.forEach((groupFilters) => {
                        if (key === groupFilters.name) {
                            const jsonFilterTemp = jsonFilter;
                            jsonFilterTemp.weight = 700;
                            const index = filterTemp.findIndex(
                                (x) => x.label === jsonFilter.label
                            );
                            if (index === -1) {
                                if (list.filters[key].condition) {
                                    filterTemp.push({
                                        display: "",
                                        disabled: false,
                                        validationDisplay: "none",
                                        label: jsonFilter.label,
                                        isSubFilter: jsonFilter.isSubFilter,
                                        isGroupFilter: jsonFilter.isGroupFilter,
                                        groupFilter: jsonFilter.groupFilter,
                                        condition: jsonFilter.condition
                                    });
                                } else {
                                    filterTemp.push({
                                        display: "none",
                                        disabled: true,
                                        validationDisplay: "none",
                                        label: jsonFilter.label,
                                        isSubFilter: jsonFilter.isSubFilter,
                                        isGroupFilter: jsonFilter.isGroupFilter,
                                        groupFilter: jsonFilter.groupFilter,
                                        condition: jsonFilter.condition
                                    });
                                }
                            }

                            jsonFilter.groupFilter.forEach((groupedFilter) => {
                                if (
                                    !Object.prototype.hasOwnProperty.call(
                                        initialValueObject,
                                        groupedFilter.name
                                    )
                                ) {
                                    if (
                                        groupedFilter.dataType ===
                                            "IFlightNumber" ||
                                        groupedFilter.dataType ===
                                            "MasterSelect"
                                    ) {
                                        initialValueObject[
                                            groupedFilter.name
                                        ] = [];
                                    } else {
                                        initialValueObject[groupedFilter.name] =
                                            "";
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });
        filter = [...filterTemp];
        initialValueObject = {
            ...initialValueTemp
        };
        if (filter.length > 0) {
            showDrawer();
            closeLeftPopUp();
        }
    };

    return (
        <div>
            <OutsideClickHandler onOutsideClick={closeDrawer}>
                {showApplyFilter && (
                    <div className="neo-filter filter--grid iCargo__custom">
                        <div className="filter__wrap">
                            <div className="filter__list">
                                <LeftDrawer
                                    filterData={filterData}
                                    individualFiltersfromLeftToRight={
                                        individualFiltersfromLeftToRight
                                    }
                                    accordionFiltersFromLeftToRight={
                                        accordionFiltersFromLeftToRight
                                    }
                                    groupFiltersFromLeftToRight={
                                        groupFiltersFromLeftToRight
                                    }
                                />
                            </div>
                            <div className="filter__inputwrap">
                                <RightDrawer
                                    filters={filters}
                                    applyFilter={applyFilter}
                                    closeDrawer={closeDrawer}
                                    resetDrawer={resetDrawer}
                                    filterCount={filterCount}
                                    emptyFilterClassName={emptyFilterClassName}
                                    emptyFilterWarning={emptyFilterWarning}
                                    recentFilterShowProp={recentFilterShow}
                                    filterShowProp={filterShow}
                                    initialValuesObject={initialValuesObject}
                                    applyFilterValidation={
                                        applyFilterValidation
                                    }
                                    applyValidator={applyValidator}
                                    closeField={closeField}
                                    conditionHandler={conditionHandler}
                                    groupFilterCloseField={
                                        groupFilterCloseField
                                    }
                                    groupFilterConditionHandler={
                                        groupFilterConditionHandler
                                    }
                                    listViewClick={listViewClick}
                                    listView={listView}
                                    savedFilters={savedFilters}
                                    listViewName={listViewName}
                                    savedFilterName={savedFilterName}
                                    savedFilterClick={savedFilterClick}
                                    completeListViewClick={
                                        completeListViewClick
                                    }
                                    completeSavedFilterClick={
                                        completeSavedFilterClick
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </OutsideClickHandler>
            <MainFilterPanel
                listViewName={listViewName}
                savedFilterName={savedFilterName}
                showDrawer={showDrawer}
                applyFilterChip={applyFilterChip}
                CustomPanel={CustomPanel}
                listView={listView}
                savedFilters={savedFilters}
                handlelistViewClick={handlelistViewClick}
                openLeftPopUp={openLeftPopUp}
                leftPopUpShow={leftPopUpShow}
                closeLeftPopUp={closeLeftPopUp}
                handleSavedFilterClick={handleSavedFilterClick}
            />
        </div>
    );
}

Filter.propTypes = {
    filterDataProp: PropTypes.any,
    appliedFiltersProp: PropTypes.any,
    CustomPanel: PropTypes.any,
    listView: PropTypes.any,
    savedFilters: PropTypes.any,
    oneTimeValues: PropTypes.any
};
