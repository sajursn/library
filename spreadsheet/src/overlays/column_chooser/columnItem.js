import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./itemTypes";

const style = {
    cursor: "move"
};

const ColumnItem = ({ id, text, moveColumn, findColumn }) => {
    const originalIndexValue = findColumn(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.COLUMN, id, originalIndexValue },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const { id: droppedId, originalIndex } = monitor.getItem();
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveColumn(droppedId, originalIndex);
            }
        }
    });

    const [, drop] = useDrop({
        accept: ItemTypes.COLUMN,
        canDrop: () => false,
        hover({ id: draggedId }) {
            if (draggedId !== id) {
                const { index: overIndex } = findColumn(id);
                moveColumn(draggedId, overIndex);
            }
        }
    });

    const opacity = isDragging ? 0.1 : 1;

    return (
        <div
            data-testid="columnItem"
            ref={(node) => drag(drop(node))}
            style={{ ...style, opacity }}
        >
            {text}
        </div>
    );
};

ColumnItem.propTypes = {
    id: PropTypes.any,
    text: PropTypes.any,
    moveColumn: PropTypes.any,
    findColumn: PropTypes.any
};

export default ColumnItem;
