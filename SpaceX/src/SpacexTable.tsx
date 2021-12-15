import React, { useState } from "react";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridColDef,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import useAxios from "axios-hooks";

function escapeRegExp(value: any) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function QuickSearchToolbar(props: any) {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
        justifyContent: "space-between",
        display: "flex",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <div>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </div>
      <TextField
        variant="standard"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search…"
        InputProps={{
          startAdornment: <SearchIcon fontSize="small" />,
          endAdornment: (
            <IconButton
              title="Clear"
              aria-label="Clear"
              size="small"
              style={{ visibility: props.value ? "visible" : "hidden" }}
              onClick={props.clearSearch}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          width: {
            xs: 1,
            sm: "auto",
          },
          m: (theme) => theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            mr: 0.5,
          },
          "& .MuiInput-underline:before": {
            borderBottom: 1,
            borderColor: "divider",
          },
        }}
      />
    </Box>
  );
}
QuickSearchToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

interface Props {
  dataTestid?: string;
}

export const SpacexTable = ({ dataTestid = 'provision-data-test-id' }: Props) => {
  // get most recent 50 launches from SpaceX API.
  const [{ data, loading, error }] = useAxios(
    "https://api.spacexdata.com/v3/launches/past?sort=flight_number&order=desc&limit=50"
  );

  //parse the launch_date_local string into a date object.
  const parseDateString = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const tableRows = data?.map((item: any) => ({
    id: item.flight_number,
    launch_name: item.mission_name,
    launch_date_local: parseDateString(item.launch_date_local),
    rocket_details: item.rocket.rocket_name || "Launch details not available",
  }));
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState(tableRows);
  const [filteredRows, setFilteredRows] = useState(null);

  const requestSearch = (searchValue: React.SetStateAction<string>) => {
    setSearchText(searchValue);
    //filter the table rows based on the search text.
    const filteredRows = tableRows.filter((row: any) => {
      const regex = new RegExp(escapeRegExp(searchValue), "gi");
      return regex.test(row.launch_name);
    });
    setFilteredRows(filteredRows);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Flight ID" },
    { field: "launch_name", headerName: "Launch Name", width: 300 },
    { field: "launch_date_local", headerName: "Launch Date", width: 150 },
    { field: "rocket_details", headerName: "Rocket Details", width: 150 },
  ];
  return (
    <div data-testid={dataTestid}
      style={{
        height: 500,
        width: "40%",
      }}
    >
      <DataGrid   
        rows={filteredRows ? filteredRows : rows}
        columns={columns}
        components={{ Toolbar: QuickSearchToolbar }}
        componentsProps={{
          toolbar: {
            value: searchText,
            onChange: (event: {
              target: { value: React.SetStateAction<string> };
            }) => requestSearch(event.target.value),
            clearSearch: () => requestSearch(""),
          },
        }}
      />
    </div>
  );
}
