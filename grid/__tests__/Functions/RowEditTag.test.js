/* eslint-disable no-undef */
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RowEditTag from "../../src/Functions/RowEditTag";
import { RowEditContext } from "../../src/Utilities/TagsContext";

const columnsdata = [
    {
        Header: "Id",
        accessor: "travelId",
        width: 50,
        disableFilters: true,
        columnId: "column_0",
        display: true
    },
    {
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
        display: true,
        isSearchable: true
    },
    {
        Header: "Segment",
        accessor: "segment",
        width: 100,
        innerCells: [
            {
                Header: "From",
                accessor: "from",
                display: true,
                cellId: "column_2_cell_1",
                isSearchable: true
            },
            {
                Header: "To",
                accessor: "to",
                display: true,
                cellId: "column_2_cell_1",
                isSearchable: true
            }
        ],
        disableSortBy: true,
        columnId: "column_2",
        display: true,
        isSearchable: true
    },
    {
        Header: "Weight",
        accessor: "weight",
        width: 130,
        innerCells: [
            {
                Header: "Percentage",
                accessor: "percentage",
                display: true,
                cellId: "column_3_cell_0",
                isSearchable: true
            },
            {
                Header: "Value",
                accessor: "value",
                display: true,
                cellId: "column_3_cell_1",
                isSearchable: true
            }
        ],
        sortValue: "percentage",
        columnId: "column_3",
        display: true,
        isSearchable: true
    },
    {
        Header: "SR",
        accessor: "sr",
        width: 90,
        columnId: "column_4",
        display: true,
        isSearchable: true
    }
];

const additionalColumndata = {
    Header: "Remarks",
    innerCells: [
        {
            Header: "Remarks",
            accessor: "remarks",
            display: true,
            cellId: "rowExpand_cell_0"
        },
        {
            Header: "Details",
            accessor: "details",
            display: true,
            cellId: "rowExpand_cell_1"
        }
    ],
    columnId: "rowExpand",
    display: true
};

test("should render", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: false
            }}
        >
            <RowEditTag columnKey="flight" cellKey="flightno" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
test("should render for column without innercell", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: true
            }}
        >
            <RowEditTag columnKey="sr" cellKey="sr" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
test("should render expanded content", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: true
            }}
        >
            <RowEditTag columnKey="remarks" cellKey="remarks" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
test("should render without cellkey ReactDOM", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: columnsdata,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: false
            }}
        >
            <RowEditTag columnKey="flight" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});

test("should render without Columns", () => {
    const componnet = render(
        <RowEditContext.Provider
            value={{
                columns: null,
                additionalColumn: additionalColumndata,
                isRowExpandEnabled: false
            }}
        >
            <RowEditTag columnKey="flight" />
        </RowEditContext.Provider>
    );
    expect(componnet).toBeDefined();
});
