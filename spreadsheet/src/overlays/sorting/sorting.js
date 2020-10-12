import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import PropTypes from "prop-types";
import ClickAwayListener from "react-click-away-listener";
import SortingList from "./sortingList";
import {
    IconNav,
    SortCopy,
    IconClose,
    SortDelete
} from "../../utilities/svgUtilities";

const HTML5toTouch = {
    backends: [
        {
            backend: HTML5Backend
        },
        {
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition
        }
    ]
};

class App extends React.Component {
    constructor(props) {
        super(props);
        const { sortingParamsObjectList } = this.props;
        this.state = {
            rowList: [true],
            sortingOrderList:
                sortingParamsObjectList === undefined
                    ? []
                    : sortingParamsObjectList,
            errorMessage: false
        };
    }

    add = () => {
        const { rowList, sortingOrderList } = this.state;
        const { columnFieldValue } = this.props;
        const rowLists = [...rowList];
        rowLists.push(true);
        const existingSortingOrderList = sortingOrderList;
        existingSortingOrderList.push({
            sortBy: columnFieldValue[0],
            order: "Ascending",
            sortOn: "Value"
        });
        this.setState({
            rowList: rowLists,
            sortingOrderList: existingSortingOrderList
        });
    };

    copy = (i) => {
        const { sortingOrderList } = this.state;
        const rowList = [...sortingOrderList];
        rowList.push(JSON.parse(JSON.stringify(rowList[i])));
        this.setState({ sortingOrderList: rowList });
    };

    clearAll = () => {
        const { clearAllSortingParams } = this.props;
        this.setState({
            sortingOrderList: [],
            errorMessage: false
        });
        clearAllSortingParams();
    };

    remove = (i) => {
        const { sortingOrderList } = this.state;
        const sortingOrderLists = [...sortingOrderList];
        sortingOrderLists.splice(i, 1);
        this.setState({ sortingOrderList: sortingOrderLists });
        if (sortingOrderList.length <= 1) {
            this.setState({ errorMessage: false });
        }
    };

    createColumnsArrayFromProps = (rowsValue) => {
        const { columnFieldValue } = this.props;
        return rowsValue.map((row, index) => {
            return {
                id: index,
                text: (
                    <div className="sort__bodyContent" key={row}>
                        <div className="sort__reorder">
                            <div className="">
                                <div>&nbsp;</div>
                            </div>

                            <div className="sort__icon">
                                <i>
                                    <IconNav />
                                </i>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>Sort by</div>
                            </div>

                            <div className="sort__file">
                                <select
                                    data-testid="selectSortingField"
                                    className="custom__ctrl"
                                    name="sortBy"
                                    onChange={(e) =>
                                        this.captureSortingFeildValues(
                                            e,
                                            index,
                                            "sortBy"
                                        )
                                    }
                                    value={row.sortBy}
                                >
                                    {columnFieldValue.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>Sort on</div>
                            </div>

                            <div className="sort__file">
                                <select
                                    className="custom__ctrl"
                                    name="sortOn"
                                    data-testid="selectingValue"
                                    onChange={(e) =>
                                        this.captureSortingFeildValues(
                                            e,
                                            index,
                                            "sortOn"
                                        )
                                    }
                                    value={row.sortOn}
                                >
                                    <option>Value</option>
                                </select>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>Order</div>
                            </div>

                            <div className="sort__file">
                                <select
                                    data-testid="selectOrder"
                                    className="custom__ctrl"
                                    name="order"
                                    onChange={(e) =>
                                        this.captureSortingFeildValues(
                                            e,
                                            index,
                                            "order"
                                        )
                                    }
                                    value={row.order}
                                >
                                    <option>Ascending</option>
                                    <option>Descending</option>
                                </select>
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>&nbsp;</div>
                            </div>

                            <div
                                data-testid="copySort"
                                role="presentation"
                                className="sort__icon"
                                onClick={() => this.copy(index)}
                            >
                                <SortCopy />
                            </div>
                        </div>

                        <div className="sort__reorder">
                            <div className="">
                                <div>&nbsp;</div>
                            </div>

                            <div
                                data-testid="removeSort"
                                role="presentation"
                                className="sort__icon"
                                onClick={() => this.remove(index)}
                            >
                                <SortDelete />
                            </div>
                        </div>
                    </div>
                )
            };
        });
    };

    captureSortingFeildValues = (event, index, sortingKey) => {
        const { sortingOrderList } = this.state;
        const existingSortingOrderList = sortingOrderList;

        if (sortingKey === "sortBy") {
            existingSortingOrderList[index].sortBy = event.target.value;
        }
        if (sortingKey === "order") {
            existingSortingOrderList[index].order = event.target.value;
        }
        if (
            existingSortingOrderList[index].sortOn === "" ||
            existingSortingOrderList[index].sortOn === undefined
        ) {
            existingSortingOrderList[index].sortOn = "Value";
        }
        this.setState({
            sortingOrderList: existingSortingOrderList
        });
    };

    updateTableAsPerSortCondition = () => {
        const { sortingOrderList } = this.state;
        const unique = new Set();
        const showError = sortingOrderList.some(
            (element) => unique.size === unique.add(element.sortBy).size
        );
        const { setTableAsPerSortingParams } = this.props;
        if (showError) {
            this.setState({ errorMessage: true });
        } else {
            this.setState({ errorMessage: false });
            setTableAsPerSortingParams(sortingOrderList);
        }
    };

    /**
     *
     * @param {*} reOrderedSortingList
     */
    handleReorderListOfSort = (reOrderedIndexList) => {
        const { handleTableSortSwap } = this.props;
        handleTableSortSwap(reOrderedIndexList);
    };

    handleClick = () => {
        const { closeSorting } = this.props;
        closeSorting();
    };

    render() {
        const { sortingOrderList, errorMessage } = this.state;
        const { closeSorting } = this.props;
        return (
            <ClickAwayListener onClickAway={this.handleClick}>
                <div className="neo-spreadsheet-popover">
                    <div className="neo-spreadsheet-popover__sort">
                        <div className="neo-spreadsheet-popover__title">
                            <h2>Sort</h2>
                            <div className="neo-spreadsheet-popover__close">
                                <i
                                    role="presentation"
                                    data-testid="closeSorting"
                                    onClick={() => closeSorting()}
                                >
                                    <IconClose />
                                </i>
                            </div>
                        </div>

                        <div className="neo-spreadsheet-popover__content">
                            <DndProvider
                                backend={MultiBackend}
                                options={HTML5toTouch}
                            >
                                <SortingList
                                    handleReorderListOfSort={
                                        this.handleReorderListOfSort
                                    }
                                    sortsArray={this.createColumnsArrayFromProps(
                                        sortingOrderList
                                    )}
                                />
                            </DndProvider>
                        </div>
                        <div className="sort-warning">
                            {errorMessage ? (
                                <span className="alert alert-danger">
                                    Sort by opted are same, Please choose
                                    different one.
                                </span>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="sort__new">
                            <div
                                role="presentation"
                                className="sort__section"
                                data-testid="addSort"
                                onClick={() => this.add()}
                                onKeyDown={() => this.add()}
                            >
                                <span>+</span>
                                <div className="sort__txt">New Sort</div>
                            </div>
                        </div>
                        <div className="sort__footer">
                            <div className="sort__btns">
                                <button
                                    type="button"
                                    className="btns"
                                    onClick={this.clearAll}
                                >
                                    Clear All
                                </button>

                                <button
                                    data-testid="applySort"
                                    type="button"
                                    className="btns btns__save"
                                    onClick={() =>
                                        this.updateTableAsPerSortCondition()
                                    }
                                >
                                    Ok
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </ClickAwayListener>
        );
    }
}

App.propTypes = {
    sortingParamsObjectList: PropTypes.arrayOf(PropTypes.object),
    closeSorting: PropTypes.func,
    columnFieldValue: PropTypes.any,
    clearAllSortingParams: PropTypes.func,
    setTableAsPerSortingParams: PropTypes.func,
    handleTableSortSwap: PropTypes.func
};

export default App;
