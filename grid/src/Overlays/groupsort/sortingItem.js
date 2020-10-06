import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";

import { IconNav, SortCopy, SortDelete } from "../../Utilities/SvgUtilities";

const SortItem = ({
    id,
    sortOption,
    columns,
    moveSort,
    findSort,
    updateSingleSortingOption,
    copySortOption,
    deleteSortOption
}) => {
    const originalIndex = findSort(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.SORT_ITEM, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const monitorGetItemValue = monitor.getItem();
            const { id: droppedId } = monitorGetItemValue;
            const newOriginalIndex = monitorGetItemValue.originalIndex;
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveSort(droppedId, newOriginalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.SORT_ITEM,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findSort(id);
                moveSort(draggedId, overIndex);
            }
        }
    });

    const getInncerCellsOfColumn = (columnAccessor) => {
        const origCol = columns.find((column) => {
            return column.accessor === columnAccessor;
        });
        if (origCol && origCol.innerCells) {
            return origCol.innerCells;
        }
        return [];
    };

    const changeSortByOptions = (event) => {
        const newSortByValue = event.target.value;
        const innerCellsList = getInncerCellsOfColumn(newSortByValue);
        updateSingleSortingOption(
            id,
            newSortByValue,
            innerCellsList && innerCellsList.length > 0
                ? innerCellsList[0].accessor
                : "value",
            sortOption.order
        );
    };

    const changeSortOnOptions = (event) => {
        const newSortOnValue = event.target.value;
        updateSingleSortingOption(
            id,
            sortOption.sortBy,
            newSortOnValue,
            sortOption.order
        );
    };

    const changeSortOrderOptions = (event) => {
        const newSortOrderValue = event.target.value;
        updateSingleSortingOption(
            id,
            sortOption.sortBy,
            sortOption.sortOn,
            newSortOrderValue
        );
    };

    const copySort = () => {
        copySortOption(id);
    };

    const deleteSort = () => {
        deleteSortOption(id);
    };

    const opacity = isDragging ? 0.5 : 1;

    return (
        <div className="sort__bodyContent" style={{ opacity }}>
            <div className="sort__reorder">
                <div
                    data-testid="sortItem"
                    ref={(node) => drag(drop(node))}
                    style={{ cursor: "move" }}
                >
                    <i>
                        <IconNav />
                    </i>
                </div>
            </div>

            <div className="sort__reorder">
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        onChange={changeSortByOptions}
                        value={sortOption.sortBy}
                    >
                        {columns.map((orgItem) => (
                            <option
                                key={orgItem.columnId}
                                value={orgItem.accessor}
                            >
                                {orgItem.Header}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        onChange={changeSortOnOptions}
                        value={sortOption.sortOn}
                    >
                        {getInncerCellsOfColumn(sortOption.sortBy) &&
                        getInncerCellsOfColumn(sortOption.sortBy).length > 0 ? (
                            getInncerCellsOfColumn(sortOption.sortBy).map(
                                (innerCellItem) => (
                                    <option
                                        key={`${innerCellItem.Header}_${innerCellItem.accessor}`}
                                        value={innerCellItem.accessor}
                                    >
                                        {innerCellItem.Header}
                                    </option>
                                )
                            )
                        ) : (
                            <option key={0} value="value">
                                Value
                            </option>
                        )}
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div className="sort__file">
                    <select
                        className="custom__ctrl"
                        value={sortOption.order}
                        onChange={changeSortOrderOptions}
                    >
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>
                </div>
            </div>
            <div className="sort__reorder">
                <div
                    className="sort__icon"
                    role="presentation"
                    onClick={copySort}
                >
                    <i>
                        <SortCopy />
                    </i>
                </div>
            </div>
            <div className="sort__reorder">
                <div
                    className="sort__icon"
                    role="presentation"
                    onClick={deleteSort}
                >
                    <i>
                        <SortDelete />
                    </i>
                </div>
            </div>
        </div>
    );
};

SortItem.propTypes = {
    id: PropTypes.number,
    sortOption: PropTypes.object,
    columns: PropTypes.arrayOf(PropTypes.object),
    moveSort: PropTypes.func,
    findSort: PropTypes.func,
    updateSingleSortingOption: PropTypes.func,
    copySortOption: PropTypes.func,
    deleteSortOption: PropTypes.func
};

export default SortItem;
