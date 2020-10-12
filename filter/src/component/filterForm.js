import React, { useEffect, useState, Suspense } from "react";
import { ISelect } from "@neo-ui/select";
import { IToggle } from "@neo-ui/toggle";
import PropTypes from "prop-types";
import { useFormikContext } from "formik";
import { IconTimes, IconCondition } from "../utilities/svgUtilities";
import components from "../dynamicImport/dynamicImportProcessor";

const FilterForm = (props) => {
    const { values, setFieldValue } = useFormikContext();
    const [filterArray, setFilterArray] = useState([]);
    const { filters } = props;
    useEffect(() => {
        if (filters) {
            setFilterArray(filters);
        }
    }, [filters]);

    const componentDiv = filterArray.map((filter, index) => {
        if (filter.isGroupFilter) {
            return (
                <div className="form-group" key={`${filter.label}`}>
                    <div className="title">
                        <h4>{filter.label}</h4>
                        <div className="controls">
                            {filter.condition && filter.condition.length > 0 && (
                                <div className="control__condition__wrap">
                                    <IToggle
                                        name={`${filter.label},check`}
                                        onChange={() => {
                                            props.groupFilterConditionHandler(
                                                filter,
                                                values,
                                                setFieldValue
                                            );
                                        }}
                                    />
                                    <div className="control__condition">
                                        <IconCondition />
                                    </div>
                                </div>
                            )}
                            <div
                                role="presentation"
                                data-testid="closeField"
                                className="control__close"
                                onClick={() => {
                                    props.groupFilterCloseField(filter);
                                }}
                            >
                                <IconTimes />
                            </div>
                        </div>
                    </div>
                    <div className="form-inputs">
                        {filter.conditionFieldName && (
                            <div
                                disabled={filter.disabled}
                                style={{
                                    display: filter.display
                                }}
                            >
                                <label>Condition</label>
                                <ISelect
                                    name={filter.conditionFieldName}
                                    options={filter.condition}
                                />
                                <br />
                            </div>
                        )}
                        {filter.groupFilter.map((quanta, indice) => {
                            const Component = components[quanta.dataType];
                            return (
                                <div>
                                    <Suspense
                                        key={indice}
                                        fallback={<div> Loading...</div>}
                                    >
                                        <p>{quanta.label}</p>
                                        <Component
                                            name={quanta.name}
                                            {...(quanta.props
                                                ? quanta.props
                                                : {})}
                                            // isRequired={
                                            //     filter.dataType === "IAirport"
                                            //         ? ""
                                            //         : filter.isRequired
                                            // }
                                        />
                                    </Suspense>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        const Component = components[filter.dataType];
        return (
            <div className="form-group" key={`${filter.name}`}>
                <div className="title">
                    {filter.type && (
                        <h4>{`${filter.label} > ${filter.type}`}</h4>
                    )}
                    {!filter.type && <h4>{filter.label}</h4>}
                    <div className="controls">
                        {filter.condition && filter.condition.length > 0 && (
                            <div className="control__condition__wrap">
                                <IToggle
                                    name={`${filter.labelName},check`}
                                    onChange={() => {
                                        props.conditionHandler(
                                            filter,
                                            values,
                                            setFieldValue
                                        );
                                    }}
                                />
                                <div className="control__condition">
                                    <IconCondition />
                                </div>
                            </div>
                        )}
                        <div
                            role="presentation"
                            data-testid="closeField"
                            className="control__close"
                            onClick={() => {
                                props.closeField(filter, setFieldValue);
                            }}
                        >
                            <IconTimes />
                        </div>
                    </div>
                </div>
                <div className="form-inputs">
                    {filter.conditionFieldName && (
                        <div>
                            <label>Condition</label>
                            <ISelect
                                name={filter.conditionFieldName}
                                options={filter.condition}
                            />
                            <br />
                        </div>
                    )}
                    <Suspense key={index} fallback={<div> Loading...</div>}>
                        <Component
                            name={filter.name}
                            {...(filter.props ? filter.props : {})}
                            // isRequired={
                            //     filter.dataType === "IAirport"
                            //         ? ""
                            //         : filter.isRequired
                            // }
                        />
                    </Suspense>
                </div>
            </div>
        );
    });
    return <div>{componentDiv}</div>;
};

FilterForm.propTypes = {
    conditionHandler: PropTypes.any,
    closeField: PropTypes.any,
    filters: PropTypes.any,
    groupFilterCloseField: PropTypes.any,
    groupFilterConditionHandler: PropTypes.any
};

export default FilterForm;
