import React from "react";
import { useDrag, useDrop } from "react-dnd";
import PropTypes from "prop-types";
import { ItemTypes } from "./ItemTypes";
import { IconJustify } from "../../Utilities/SvgUtilities";

const ColumnItem = ({
    id,
    columnHeader,
    moveColumn,
    findColumn,
    isadditionalcolumn,
    innerCells,
    onInnerCellChange
}) => {
    const originalIndex = findColumn(id).index;

    const [{ isDragging }, drag] = useDrag({
        item: { type: ItemTypes.COLUMN, id, originalIndex },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (dropResult, monitor) => {
            const monitorGetItemValue = monitor.getItem();
            const { id: droppedId } = monitorGetItemValue;
            const newOriginalIndex = monitorGetItemValue.originalIndex;
            const didDrop = monitor.didDrop();
            if (!didDrop) {
                moveColumn(droppedId, newOriginalIndex);
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
        <div style={{ opacity }}>
            <div className="column__reorder">
                <div
                    data-testid="columnItem"
                    ref={(node) => drag(drop(node))}
                    style={{ cursor: "move" }}
                    className="column_drag"
                >
                    <i>
                        <IconJustify />
                    </i>
                </div>
                <div className="columnItem__Header">{columnHeader}</div>
                <div className="column__innerCells__wrap">
                    {innerCells && innerCells.length > 0
                        ? innerCells.map((cell) => {
                              const { cellId, Header, display } = cell;
                              return (
                                  <div className="column__wrap" key={cellId}>
                                      <div className="column__checkbox">
                                          <div className="form-check">
                                              <input
                                                  type="checkbox"
                                                  id={`chk_selectInnerCell_${cellId}`}
                                                  className="form-check-input custom-checkbox form-check-input"
                                                  data-testid={`selectInnerCell_${id}_${cellId}`}
                                                  data-columnid={id}
                                                  data-cellid={cellId}
                                                  data-isadditionalcolumn={
                                                      isadditionalcolumn
                                                  }
                                                  checked={display}
                                                  onChange={onInnerCellChange}
                                              />
                                              <label
                                                  htmlFor={`chk_selectInnerCell_${cellId}`}
                                                  className="form-check-label"
                                              >
                                                  {Header}
                                              </label>
                                          </div>
                                      </div>
                                  </div>
                              );
                          })
                        : null}
                </div>
            </div>
        </div>
    );
};

ColumnItem.propTypes = {
    id: PropTypes.string,
    columnHeader: PropTypes.string,
    moveColumn: PropTypes.func,
    findColumn: PropTypes.func,
    isadditionalcolumn: PropTypes.bool,
    innerCells: PropTypes.arrayOf(PropTypes.object),
    onInnerCellChange: PropTypes.func
};

export default ColumnItem;
