import React, { useEffect, useState, useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  ThemeProvider,
  TextField,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ThemeContext from '../../ThemeContext';
import { darkTheme, lightTheme } from '../../themes';

export default function BasicTable() {
  const [TableData, setTableData] = useState([]);
  const [FilterData, setFilterData] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const {
    theme,
  } = useContext(ThemeContext);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const textChange = (ev) => {
    const inputText = ev.target?.value?.toLowerCase();
    setFilterData(inputText);
  };

  console.log('default data', FilterData);

  useEffect(() => {
    const fetchTableData = async () => {
      await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then((res) => res.json()).then((data) => setTableData(data))
        .catch((err) => {
          console.log('error getting TableData', err);
        });
    }
    fetchTableData();
  }, []);

  const headText = {
    fontWeight: 700,
    fontWize: '18px'
  };

  return (
    <ThemeProvider theme={theme ? darkTheme : lightTheme}>
      <TextField style={{paddingBottom: "20px"}} label="Search Currency" fullWidth={true} placeholder="Enter Currency details" value={FilterData} onChange={(ev) => textChange(ev)} />
    <Paper sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead style={{ background: 'rgb(238, 188, 29)' }}>
            <TableRow>
              <TableCell style={headText}>Coin</TableCell>
              <TableCell style={headText} align="right">Price</TableCell>
              <TableCell style={headText} align="right">24h change</TableCell>
              <TableCell style={headText} align="right">Market Cap</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TableData && TableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).filter((fil) => fil?.name?.toLowerCase()?.includes(FilterData)).map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                  <TableCell style={{ display: 'flex', gap: '10px' }} component="th" scope="row">
                    <Link to={`/coins/${row.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      <img width="50px" src={row.image} alt={row.name} />
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ textTransform: 'uppercase', fontSize: '22px' }}>{row.symbol}</span>
                      <span style={{ color: 'darkgrey' }}>{row.name}</span>
                    </div>
                  </TableCell>
                <TableCell align="right">{row.current_price}</TableCell>
                <TableCell align="right" style={{ color: row.price_change_percentage_24h > 0 ? 'green' : 'red', fontWeight: 700 }}>
                  {row.price_change_percentage_24h > 0 ? '+' : ''}{row.price_change_percentage_24h.toFixed(2)}
                </TableCell>
                <TableCell align="right">₹ {row.market_cap.toString().slice(0, 8)}M</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> 
      </TableContainer>
      { TableData?.length && <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={TableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> }
      </Paper>
      </ThemeProvider>
  );
}