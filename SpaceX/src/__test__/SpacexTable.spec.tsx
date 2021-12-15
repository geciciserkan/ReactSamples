import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "@testing-library/dom";
import { SpacexTable } from "../SpacexTable";

describe("@Component <SpacexTable />", () => {
  const dataTestid = "table-data-test-id";
  it("should render SpacexTable component", () => {
    render(<SpacexTable dataTestid={dataTestid} />);
    expect(screen.getByTestId(dataTestid)).toBeInTheDocument();
  });
});
