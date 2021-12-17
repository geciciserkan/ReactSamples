import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridColDef,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import {
  getLaunches,
  setSelectedLaunch,
} from "../../store/actions/launches.actions";
import { Button, CardMedia, Modal, Typography } from "@mui/material";
import "./styles.css";

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

const SpacexTable = ({ dataTestid = "provision-data-test-id" }: Props) => {
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchText, setSearchText] = useState("");

  const dispatch = useDispatch();
  const { isLoading, launches, errorMessage, selected } = useSelector(
    (state: any) => state.launches
  );

  useEffect(() => {
    dispatch(getLaunches());
  }, []);

  useEffect(() => {
    if (launches && launches.length > 0) {
      setFilteredRows(launches);
    }
  }, [launches]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Flight ID",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
    },
    {
      field: "launch_name",
      headerName: "Launch Name",
      width: 300,
      disableColumnMenu: true,
    },
    {
      field: "launch_date_local",
      headerName: "Launch Date",
      width: 150,
      type: "date",
      disableColumnMenu: true,
    },
    {
      field: "rocket_details",
      headerName: "Rocket Details",
      width: 150,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Button
            onClick={() => dispatch(setSelectedLaunch(params.row.full_details))}
          >
            Click to View
          </Button>
        );
      },
    },
  ];

  const requestSearch = (searchValue: React.SetStateAction<string>) => {
    setSearchText(searchValue);
    const filteredBySearch = launches.filter((row: any) => {
      const regex = new RegExp(escapeRegExp(searchValue), "gi");
      return regex.test(row.launch_name);
    });
    setFilteredRows(filteredBySearch);
  };

  const handleCloseModal = () => {
    dispatch(setSelectedLaunch(null));
  };

  return (
    <div
      data-testid={dataTestid}
      className="ag-theme-alpine"
      style={{
        height: 500,
        width: "40%",
      }}
    >
      <DataGrid
        rows={filteredRows}
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
        loading={isLoading}
      />
      <Modal
        open={selected || false}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-container">
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {selected?.mission_name}{" "}
            {selected?.launch_year && `(${selected?.launch_year})`}
          </Typography>
          <CardMedia
            component="img"
            image={selected?.links.mission_patch_small}
            alt={selected?.mission_name}
          />
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selected?.details}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default SpacexTable;
