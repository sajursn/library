/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { TouchBackend } from "react-dnd-touch-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import MultiBackend, { TouchTransition } from "react-dnd-multi-backend";
import ColumnsList from "../../../src/Overlays/managecolumns/columnsList";
import "@testing-library/jest-dom/extend-expect";

const HTML5toTouch = {
    backends: [
        {
            backend: HTML5Backend
        },
        {
            backend: TouchBackend,
            options: { enableMouseEvents: true },
            preview: true,
            transition: TouchTransition
        }
    ]
};

const managedColumns = [
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
    }
];
const updateColumnsInState = jest.fn();
const selectInnerCells = jest.fn();

describe("render ColumnItem", () => {
    it("should renders parent component", () => {
        const { getByText, container } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    managedColumns={managedColumns}
                    onColumnReorder={updateColumnsInState}
                    onInnerCellChange={selectInnerCells}
                />
            </DndProvider>
        );
        const childComponent = container.querySelector("div");
        expect(childComponent).toBeInTheDocument();
        expect(getByText("Flight")).toBeInTheDocument();
    });
    it("should work drag and drop functionality", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    managedColumns={managedColumns}
                    onColumnReorder={updateColumnsInState}
                    onInnerCellChange={selectInnerCells}
                />
            </DndProvider>
        );
        expect(getAllByTestId("columnItem")).toHaveLength(2);
        const startingNode = getAllByTestId("columnItem")[0];
        const endingNode = getAllByTestId("columnItem")[1];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        endingNode.dispatchEvent(
            createBubbledEvent("drop", { clientX: 0, clientY: 1 })
        );
        fireEvent.dragEnd(startingNode);
    });
    it("should work drag and drop functionality with didDrop false", () => {
        const createBubbledEvent = (type, props = {}) => {
            const event = new Event(type, { bubbles: true });
            Object.assign(event, props);
            return event;
        };
        const { getAllByTestId } = render(
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <ColumnsList
                    managedColumns={managedColumns}
                    onColumnReorder={updateColumnsInState}
                    onInnerCellChange={selectInnerCells}
                />
            </DndProvider>
        );
        expect(getAllByTestId("columnItem")).toHaveLength(2);
        const startingNode = getAllByTestId("columnItem")[0];
        startingNode.dispatchEvent(
            createBubbledEvent("dragstart", { clientX: 0, clientY: 0 })
        );
        fireEvent.dragEnd(startingNode);
    });
});
