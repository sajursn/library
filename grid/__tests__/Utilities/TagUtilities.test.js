/* eslint-disable no-undef */
import { checkInnerCells } from "../../src/Utilities/TagUtilities";

test("Test checkInnerCells without column", () => {
    const mockCheckInnerCells = jest.fn().mockImplementation(checkInnerCells);
    mockCheckInnerCells(null, "flight");
    expect(mockCheckInnerCells).toHaveBeenCalled();
});
test("Test checkInnerCells with column", () => {
    const column = {
        Header: "Flight",
        accessor: "flight",
        width: 100,
        innerCells: [
            {
                Header: "Flight No",
                accessor: "flightno",
                display: true,
                cellId: "column_1_cell_0",
                isSearchable: true
            },
            {
                Header: "Date",
                accessor: "date",
                display: true,
                cellId: "column_1_cell_1",
                isSearchable: true
            }
        ],
        sortValue: "flightno",
        columnId: "column_1",
        isDisplayInExpandedRegion: false,
        display: true,
        isSearchable: true
    };
    const mockCheckInnerCells = jest.fn().mockImplementation(checkInnerCells);
    mockCheckInnerCells(column, "flightno");
    expect(mockCheckInnerCells).toHaveBeenCalled();
});
