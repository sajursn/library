import React from "react";
import ReactDOM from "react-dom";
import ReactTestUtils, { act } from "react-dom/test-utils";
import CheckboxEditor from "../../src/functions/checkboxEditor";

let container;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    document.body.removeChild(container);
    container = null;
});

test("CheckboxEditor", () => {
    const props = {
        column: "stackable"
    };
    act(() => {
        ReactDOM.render(<CheckboxEditor {...props} />, container);
    });
    const component = ReactTestUtils.renderIntoDocument(
        <CheckboxEditor {...props} />
    );
    component.getInputNode();
    component.onValueChanged({ target: { value: true } });
    component.getValue();
});
