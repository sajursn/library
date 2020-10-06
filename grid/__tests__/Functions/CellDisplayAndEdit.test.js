/* eslint-disable no-undef */
import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect";
import CellDisplayAndEdit from "../../src/Functions/CellDisplayAndEdit";

describe("CellDisplayAndEdit unit test", () => {
    const mockUpdateDateValue = jest.fn();
    const mockDisplayCell = jest.fn((rowData, DisplayTag) => {
        const { flightno, date } = rowData.flight;
        return (
            <div className="flight-details">
                <DisplayTag cellKey="flightno" columnKey="flight">
                    <strong>{flightno}</strong>
                </DisplayTag>
                <DisplayTag columnKey="flight" cellKey="date">
                    <span>{date}</span>
                </DisplayTag>
            </div>
        );
    });
    const mockEditCell = jest.fn((rowData, DisplayTag, rowUpdateCallBack) => {
        const { flightno, date } = rowData.flight;
        return (
            <div>
                <DisplayTag columnKey="flight" cellKey="flightno">
                    <input
                        data-testid="flightnoinput"
                        className="flight-no-input"
                        type="text"
                        value={flightno}
                        onChange={() => rowUpdateCallBack("nothing")}
                    />
                </DisplayTag>
                <DisplayTag columnKey="flight" cellKey="date">
                    <input
                        type="date"
                        value={date}
                        onChange={mockUpdateDateValue}
                    />
                </DisplayTag>
            </div>
        );
    });
    const row = {
        column: {
            id: "flight",
            Cell: jest.fn(),
            accessor: jest.fn(),
            columnId: "column_1",
            depth: 0,
            displayCell: mockDisplayCell,
            editCell: mockEditCell,
            display: true,
            isSearchable: true,
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
            isVisible: true
        },
        row: {
            original: {
                travelId: 0,
                flight: {
                    flightno: "XX2225",
                    date: "31-Aug-2016"
                }
            }
        }
    };

    const editedRowValue = {
        travelId: 0,
        flight: {
            flightno: "123",
            date: "31-Aug-2016"
        }
    };

    const incorrectRowValue = {
        column: {
            id: "flight",
            Cell: jest.fn(),
            accessor: jest.fn(),
            columnId: "column_1",
            depth: 0,
            displayCell: mockDisplayCell,
            editCell: mockEditCell,
            isSearchable: true,
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
            isVisible: true,
            display: true
        }
    };

    const columns = [
        {
            Header: "Flight",
            accessor: "flight",
            width: 100,
            columnId: "column_1",
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
            isSearchable: true,
            sortValue: "flightno",
            displayCell: mockDisplayCell,
            editCell: mockEditCell,
            display: true
        }
    ];

    let mockContainer;
    beforeEach(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });
    afterEach(cleanup);
    const mockupdateRowInGrid = jest.fn();
    it("should render component", () => {
        const { container } = render(
            <CellDisplayAndEdit
                row={row}
                columns={columns}
                updateRowInGrid={mockupdateRowInGrid}
            />
        );
        const div = container.getElementsByClassName(
            "table-cell--content table-cell--content__flight"
        );
        expect(div).toBeDefined();
    });
    it("should display edit option on clicking edit button", () => {
        act(() => {
            render(
                <CellDisplayAndEdit
                    row={row}
                    columns={columns}
                    updateRowInGrid={mockupdateRowInGrid}
                />,
                mockContainer
            );
        });
        const component = document.querySelector("[class=cell-edit]")
            .firstChild;
        act(() => {
            component.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        const editDiv = document.getElementsByClassName(
            "table-cell--content-edit"
        );
        expect(editDiv).toBeDefined();
    });
    it("should display data passed to component", () => {
        const { getByText } = render(
            <CellDisplayAndEdit
                row={row}
                columns={columns}
                updateRowInGrid={mockupdateRowInGrid}
            />
        );
        expect(getByText("31-Aug-2016")).toBeInTheDocument();
    });
    it("should close edit option by clicking on close button", () => {
        let component = null;
        act(() => {
            component = render(
                <CellDisplayAndEdit
                    row={row}
                    columns={columns}
                    updateRowInGrid={mockupdateRowInGrid}
                />,
                mockContainer
            );
        });
        const editButton = document.querySelector("[class=cell-edit]")
            .firstChild;
        act(() => {
            editButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        fireEvent.click(component.getByTestId("cell-edit-cancel"));
    });
    it("should save values in edit option by clicking on save button after making value change", () => {
        const { getByTestId } = render(
            <CellDisplayAndEdit
                row={row}
                columns={columns}
                updateRowInGrid={mockupdateRowInGrid}
            />,
            mockContainer
        );
        const editButton = document.querySelector("[class=cell-edit]")
            .firstChild;
        act(() => {
            editButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const flightNoInput = getByTestId("flightnoinput");
        expect(flightNoInput.value).toBe("XX2225");
        fireEvent.change(flightNoInput, { target: { value: "123" } });

        const setState = jest.fn(() => editedRowValue);
        const useStateSpy = jest.spyOn(React, "useState");
        useStateSpy.mockImplementation(() => [editedRowValue, setState]);
        fireEvent.click(getByTestId("cell-edit-save"));
    });
    it("should not render component", () => {
        act(() => {
            render(
                <CellDisplayAndEdit
                    row={incorrectRowValue}
                    columns={columns}
                    updateRowInGrid={mockupdateRowInGrid}
                />,
                mockContainer
            );
        });
        const editButton = document.querySelector("[class=cell-edit]");
        expect(editButton).toBe(null);
    });
});
