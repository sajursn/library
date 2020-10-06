/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RowEditOverLay from "../../src/Functions/RowEditOverlay";
import "@testing-library/jest-dom/extend-expect";

describe("render row edit overlay", () => {
    const rowdata = {
        travelId: 0,
        flight: {
            flightno: "XX2225",
            date: "31-Aug-2016"
        },
        segment: {
            from: "BCC",
            to: "ZZY"
        },
        details: {
            flightModel: 6518,
            bodyType: "Big Body",
            type: "Van",
            startTime: "01:23 (S)",
            endTime: "11:29 (E)",
            status: "To Be Cancelled",
            additionalStatus:
                "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
            timeStatus: "10:02 hrs to depart"
        },
        weight: {
            percentage: "16%",
            value: "35490/20000 kg"
        },
        volume: {
            percentage: "54%",
            value: "31/60 cbm"
        },
        uldPositions: [
            {
                position: "L1",
                value: "7/9"
            },
            {
                position: "Q1",
                value: "9/3"
            },
            {
                position: "L6",
                value: "8/4"
            },
            {
                position: "Q7",
                value: "4/9"
            }
        ],
        revenue: {
            revenue: "$63,474.27",
            yeild: "$7.90"
        },
        sr: "74/ AWBs",
        queuedBooking: {
            sr: "88/ AWBs",
            volume: "7437 kg / 31 cbm"
        },
        remarks:
            "Enim aute magna ipsum magna commodo qui aute et elit aliqua nostrud ea nulla duis. Proident dolore aliqua sint nostrud aliquip exercitation anim nulla quis cupidatat dolor nostrud aliqua incididunt. Mollit ut cillum Lorem laborum dolore proident."
    };

    const newrowdata = {
        travelId: 0,
        flight: {
            flightno: "XX222",
            date: "31-Aug-2016"
        },
        segment: {
            from: "BCC",
            to: "ZZY"
        },
        details: {
            flightModel: 6518,
            bodyType: "Big Body",
            type: "Van",
            startTime: "01:23 (S)",
            endTime: "11:29 (E)",
            status: "To Be Cancelled",
            additionalStatus:
                "Elit est consectetur deserunt et sit officia eu. Qui minim quis exercitation in irure elit velit nisi officia cillum laborum reprehenderit.aliqua ex sint cupidatat non",
            timeStatus: "10:02 hrs to depart"
        },
        weight: {
            percentage: "16%",
            value: "35490/20000 kg"
        },
        volume: {
            percentage: "54%",
            value: "31/60 cbm"
        },
        uldPositions: [
            {
                position: "L1",
                value: "7/9"
            },
            {
                position: "Q1",
                value: "9/3"
            },
            {
                position: "L6",
                value: "8/4"
            },
            {
                position: "Q7",
                value: "4/9"
            }
        ],
        revenue: {
            revenue: "$63,474.27",
            yeild: "$7.90"
        },
        sr: "74/ AWBs",
        queuedBooking: {
            sr: "88/ AWBs",
            volume: "7437 kg / 31 cbm"
        },
        remarks:
            "Enim aute magna ipsum magna commodo qui aute et elit aliqua nostrud ea nulla duis. Proident dolore aliqua sint nostrud aliquip exercitation anim nulla quis cupidatat dolor nostrud aliqua incididunt. Mollit ut cillum Lorem laborum dolore proident."
    };

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
                    cellId: "column_2_cell_0",
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
                onlyInTablet: true,
                accessor: "details",
                display: true,
                cellId: "rowExpand_cell_1"
            }
        ],
        columnId: "rowExpand",
        display: true
    };

    const mockUpdateDateValue = jest.fn();
    const getRowEditOverlayMock = jest.fn(
        (rowData, DisplayTag, rowUpdateCallBack) => {
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
        }
    );
    const closeRowEditOverlayMock = jest.fn();
    const updateRowInGridMock = jest.fn();

    it("Should render", () => {
        const { getByText } = render(
            <RowEditOverLay
                row={rowdata}
                columns={columnsdata}
                isRowExpandEnabled
                additionalColumn={additionalColumndata}
                getRowEditOverlay={getRowEditOverlayMock}
                closeRowEditOverlay={closeRowEditOverlayMock}
                updateRowInGrid={updateRowInGridMock}
            />
        );
        expect(getByText("Save")).toBeInTheDocument();
        expect(getByText("Cancel")).toBeInTheDocument();
    });

    it("Save function should be called", () => {
        const { getByText, getByTestId } = render(
            <RowEditOverLay
                row={rowdata}
                columns={columnsdata}
                isRowExpandEnabled
                additionalColumn={additionalColumndata}
                getRowEditOverlay={getRowEditOverlayMock}
                closeRowEditOverlay={closeRowEditOverlayMock}
                updateRowInGrid={updateRowInGridMock}
            />
        );

        const flightNoInput = getByTestId("flightnoinput");
        expect(flightNoInput.value).toBe("XX2225");
        fireEvent.change(flightNoInput, { target: { value: "123" } });

        const setState = jest.fn();
        const useStateSpy = jest.spyOn(React, "useState");
        useStateSpy.mockImplementation(() => [newrowdata, setState]);

        fireEvent.click(getByText("Save"));
        expect(getRowEditOverlayMock).toHaveBeenCalledTimes(3);
    });

    it("Cancel function should be called", () => {
        const { getByText } = render(
            <RowEditOverLay
                row={rowdata}
                columns={columnsdata}
                isRowExpandEnabled
                additionalColumn={additionalColumndata}
                getRowEditOverlay={getRowEditOverlayMock}
                closeRowEditOverlay={closeRowEditOverlayMock}
                updateRowInGrid={updateRowInGridMock}
            />
        );
        fireEvent.click(getByText("Cancel"));
        expect(closeRowEditOverlayMock).toHaveBeenCalledTimes(2);
    });
});
