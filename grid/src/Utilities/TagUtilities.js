export const checkInnerCells = (column, cellKey) => {
    if (column) {
        const { innerCells } = column;
        if (innerCells && innerCells.length > 0) {
            const innerCellData = innerCells.find((cell) => {
                return cell.accessor === cellKey && cell.display === true;
            });
            if (innerCellData) {
                return true;
            }
        }
    }
    return false;
};
