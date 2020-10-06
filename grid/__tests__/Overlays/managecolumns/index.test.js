/* eslint-disable no-undef */
import React from "react";
import ReactDOM from "react-dom";
import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
/* eslint-disable no-unused-vars */
import regeneratorRuntime from "regenerator-runtime";
import ColumnReordering from "../../../src/Overlays/managecolumns/index";

describe("ColumnReordering unit test", () => {
    const mockUpdateColumnStructure = jest.fn();
    const toggleManageColumnsOverlay = jest.fn();
    const mockAdditionalColumn = {
        Header: "Remarks",
        innerCells: [
            {
                Header: "Remarks",
                accessor: "remarks",
                display: true,
                cellId: "rowExpand_cell_0"
            }
        ],
        columnId: "rowExpand",
        isDisplayInExpandedRegion: true,
        display: true
    };

    const mockOriginalColumns = [
        {
            Header: "Id",
            accessor: "travelId",
            width: 50,
            disableFilters: true,
            columnId: "column_0",
            isDisplayInExpandedRegion: false,
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
            isDisplayInExpandedRegion: false,
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
            isDisplayInExpandedRegion: false,
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
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Volume",
            accessor: "volume",
            width: 100,
            innerCells: [
                {
                    Header: "Percentage",
                    accessor: "percentage",
                    display: true,
                    cellId: "column_4_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    display: true,
                    cellId: "column_4_cell_1",
                    isSearchable: true
                }
            ],
            sortValue: "percentage",
            columnId: "column_4",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "ULD Positions",
            accessor: "uldPositions",
            width: 120,
            innerCells: [
                {
                    Header: "Position",
                    accessor: "position",
                    display: true,
                    cellId: "column_5_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Value",
                    accessor: "value",
                    display: true,
                    cellId: "column_5_cell_1",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            columnId: "column_5",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Revenue/Yield",
            accessor: "revenue",
            width: 120,
            innerCells: [
                {
                    Header: "Revenue",
                    accessor: "revenue",
                    display: true,
                    cellId: "column_6_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Yeild",
                    accessor: "yeild",
                    display: true,
                    cellId: "column_6_cell_1",
                    isSearchable: true
                }
            ],
            sortValue: "revenue",
            columnId: "column_6",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "SR",
            accessor: "sr",
            width: 90,
            columnId: "column_7",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        },
        {
            Header: "Queued Booking",
            accessor: "queuedBooking",
            width: 130,
            innerCells: [
                {
                    Header: "Sr",
                    accessor: "sr",
                    display: true,
                    cellId: "column_8_cell_0",
                    isSearchable: true
                },
                {
                    Header: "Volume",
                    accessor: "volume",
                    display: true,
                    cellId: "column_8_cell_1",
                    isSearchable: true
                }
            ],
            disableSortBy: true,
            columnId: "column_8",
            isDisplayInExpandedRegion: false,
            display: true,
            isSearchable: true
        }
    ];
    afterEach(cleanup);
    let mockContainer;
    beforeAll(() => {
        mockContainer = document.createElement("div");
        document.body.appendChild(mockContainer);
    });

    it("should not render ColumnReordering component", () => {
        render(
            <ColumnReordering
                isManageColumnOverlayOpen={false}
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        const overlay = document.getElementsByClassName(
            "neo-grid-popover--column"
        );
        expect(overlay.innerHTML).toBeUndefined();
    });

    it("should render ColumnReordering component", () => {
        const { component, getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        expect(mockContainer).toBeDefined();
        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("should render ColumnReordering search component", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        const filterList = getByTestId("filterColumnsList");
        fireEvent.change(filterList, { target: { value: "id" } });
        expect(filterList.value).toBe("id");
        fireEvent.change(filterList, { target: { value: "" } });
        const coloumnBodyInnerHtml = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder");

        expect(coloumnBodyInnerHtml.length).toBe(10);
        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Click on Save button For Default Select", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const saveButton = getByTestId("save_columnsManage");
        // triggering Save button Click
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Un-select and Select All coloumns", () => {
        // LOGIC-->> UnSelect All Columns by unchecking the select All checkBox
        // expect the coloumn body (on showing all chosen coloumns) to be empty
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        const selectAllCheckBox = getByTestId("selectAllSearchableColumns");

        // unchecking the select all checkbox
        fireEvent.click(selectAllCheckBox);

        // checking the select all checkbox
        fireEvent.click(selectAllCheckBox);

        const coloumnBodyInnerHtml = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder");
        expect(coloumnBodyInnerHtml.length).toBe(10);

        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect The Segment Coloumn From Column Chooser", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const segmentColumCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__checkbox")[3]
            .getElementsByTagName("input")[0];

        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const isSegmentIncludedInBody = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .innerHTML.includes("Segment");

        expect(isSegmentIncludedInBody).toBe(false);

        const saveButton = getByTestId("save_columnsManage");

        // triggering Save button Click
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect and Select Segment Column ", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const noOfColoumnsBeforeSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        const segmentColumCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__checkbox")[3]
            .getElementsByTagName("input")[0];

        // unchecking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // checking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const noOfColoumnsAfterSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        expect(noOfColoumnsAfterSelect).toEqual(noOfColoumnsBeforeSelect);

        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect and Select Remarks Column ", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const noOfColoumnsBeforeSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        const segmentColumCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__checkbox")[10]
            .getElementsByTagName("input")[0];

        // unchecking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        // checking segment checkbox
        act(() => {
            segmentColumCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        const noOfColoumnsAfterSelect = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        expect(noOfColoumnsAfterSelect).toEqual(noOfColoumnsBeforeSelect);

        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Unselect and Select Flight no Inner Cell", () => {
        const { container, getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        const flightNoInnerCell = container.querySelectorAll(
            "[type='checkbox']"
        )[12];
        act(() => {
            flightNoInnerCell.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(flightNoInnerCell.checked).toBeFalsy();
        act(() => {
            flightNoInnerCell.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        expect(flightNoInnerCell.checked).toBeTruthy();

        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("UnSelect All and Click Reset Button without columns to expand", () => {
        const { getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );
        const selectAllCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByTagName("input")[1];
        // un-checking selectAll checkbox
        act(() => {
            selectAllCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const resetButton = document.getElementsByTagName("button")[0];
        // clicking Reset button
        act(() => {
            resetButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
        const noOfColoumnsAfterReset = document
            .getElementsByClassName("column__settings")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByClassName("column__reorder").length;

        expect(noOfColoumnsAfterReset).toEqual(10);

        const cancelButton = getByTestId("cancel_columnsManage");
        // triggering Save button Click
        act(() => {
            cancelButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Error scenario for no Coloumns Selected", () => {
        const { getAllByTestId, getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />,
            mockContainer
        );

        const selectAllCheckBox = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByTagName("input")[1];

        act(() => {
            selectAllCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });

        expect(selectAllCheckBox.checked).toBeFalsy();
        const saveButton = getByTestId("save_columnsManage");

        // un-checking selectAll checkbox
        act(() => {
            saveButton.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Select InnerCell Of Remarks", () => {
        const { container, getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );

        const remarksInnerCellCheckBox = container
            .getElementsByClassName("column__reorder")[9]
            .getElementsByClassName("column__checkbox")[0]
            .getElementsByTagName("input")[0];
        act(() => {
            remarksInnerCellCheckBox.dispatchEvent(
                new MouseEvent("click", { bubbles: true })
            );
        });
    });

    it("Trigger search of columns onChnage", () => {
        const { container, getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );

        const searchColoumnInputField = document
            .getElementsByClassName("column__chooser")[0]
            .getElementsByClassName("column__body")[0]
            .getElementsByTagName("input")[0];

        act(() => {
            searchColoumnInputField.dispatchEvent(
                new KeyboardEvent("keyDown", {
                    event: { target: { value: "id" } }
                })
            );
        });
    });

    it("should work drag and drop functionality", async () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId, getByTestId } = render(
            <ColumnReordering
                isManageColumnOverlayOpen
                toggleManageColumnsOverlay={toggleManageColumnsOverlay}
                columns={mockOriginalColumns}
                additionalColumn={mockAdditionalColumn}
                updateColumnStructure={mockUpdateColumnStructure}
            />
        );
        expect(getAllByTestId("columnItem")).toHaveLength(9);
        const startingNode = getAllByTestId("columnItem")[0];
        const endingNode = getAllByTestId("columnItem")[1];
        act(() => {
            startingNode.dispatchEvent(
                createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
            );
            endingNode.dispatchEvent(
                createBubbledEvent("drop", { clientX: 0, clientY: 1 })
            );
        });
        await waitFor(() => expect(mockUpdateColumnStructure).toBeCalled());
    });
});
