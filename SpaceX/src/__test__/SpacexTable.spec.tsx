import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/dom";
import { SpacexTable } from "../SpacexTable";
import { unmountComponentAtNode } from "react-dom";
import { createMount } from "@material-ui/core/test-utils";
import "./App.spec";

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("SpacexTable", () => {
  const dataTestid = "provision-data-test-id";
  it("should render the table", () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      render(<SpacexTable />, container);
    });
    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });
});

//Check the table columns and rows.
describe("Spacex Test", () => {
  const mount = createMount();

  test("Spacex Render", async () => {
    await act(async () => {
      mount(<SpacexTable />);
    });
    expect(await screen.findByRole("grid")).toBeInTheDocument();
    expect(await screen.findByRole("row")).toBeInTheDocument();
    expect(await screen.findAllByRole("columnheader")).toHaveLength(4);
  });
});

describe("Snapshot Testing", () => {
  const mount = createMount();

  it("Spacex Data Grid", () => {
    const wrapper = mount(<SpacexTable />);

    expect(wrapper).toMatchSnapshot();
  });
});
