export const findSelectedRows = (rows, selectedRowIds) => {
    const rowsSelectedByUser = [];
    if (rows && rows.length > 0 && selectedRowIds) {
        Object.entries(selectedRowIds).forEach((objEntry) => {
            if (objEntry && objEntry.length > 0) {
                const rowId = objEntry[0];
                const isSelected = objEntry[1];
                if (isSelected) {
                    const selectedRow = rows.find((flatRow) => {
                        return flatRow.id === rowId;
                    });
                    if (selectedRow) {
                        const { original } = selectedRow;
                        if (original) {
                            rowsSelectedByUser.push(original);
                        }
                    }
                }
            }
        });
    }
    return rowsSelectedByUser;
};

export const findSelectedRowIdAttributes = (selectedRows, idAttribute) => {
    const rowIdentifiers = [];
    if (selectedRows && selectedRows.length > 0 && idAttribute) {
        selectedRows.forEach((row) => {
            rowIdentifiers.push(row[idAttribute]);
        });
    }
    return rowIdentifiers;
};
