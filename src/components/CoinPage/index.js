import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Button, LinearProgress, Container, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '../../themes';
import ThemeContext from '../../ThemeContext';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const CoinPage = () => {
    let { coinId } = useParams();
    const [coinRes, setCoinRes] = useState([]);
    const [selectedDay, setSelectedButton] = useState("1");
    const [coinOneDay, setCoinData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const {
        theme,
    } = useContext(ThemeContext);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`)
                .then((res) => res.json()).then((data) => setCoinRes(data))
                .catch((err) => {
                    console.log('error getting coin', err);
                });
        }
        fetchData()
    }, [coinId]);

    useEffect(() => {
        const getDataOfChart = async () => {
            await fetch(`https://api.coingecko.com/api/v3/coins/binancecoin/market_chart?vs_currency=INR&days=${selectedDay}`)
                .then((res) => res.json()).then((data) => setCoinData(data.prices))
                .catch((err) => {
                    console.log('error getting coin', err);
                });
        };
        getDataOfChart();
    }, [selectedDay])

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    const createDate = (dataTime) => {
        const formDate = new Date(dataTime);
        return `${formDate.getDate()}/${formDate.getMonth()}/${formDate.getFullYear()}`
    }

    const getTimeProperly = (dateTime) => {
        const hours = new Date(dateTime).getHours();
        const typeOfHour = hours > 12 ? hours - 12 : hours;
        const mins = new Date(dateTime).getMinutes();
        const amPm = hours > 12 ? 'AM' : 'PM';
        return `${typeOfHour}:${mins} ${amPm}`;
    }

    const formatDescription = (text) => {
        const dotPosition = text.indexOf('.');
        return text.slice(0, dotPosition);
    }

    useEffect(() => {
        const formattedData = coinOneDay && coinOneDay.map((item, key, arr) => {
            if (key > 0 && Math.floor(item) === Math.floor(arr[key - 1])) {
                return null;
            }
            return {
                x: new Date(item[0]),
                y: item[1],
            };
        });
        const data = {
            labels: coinOneDay && coinOneDay.map((item) => selectedDay === '1' ? getTimeProperly(item[0]) : createDate(item[0])),
            datasets: [
                {
                    label: `Prices in past ${selectedDay} day`,
                    data: formattedData,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "gold",
                },
            ],
        };
        setChartData(data);
    }, [coinOneDay, selectedDay])

    const styleText = {
        fontFamily: 'Montserrat',
        fontSize: '16px',
    }

    const buttonStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '20px',
    }

    return (
        <ThemeProvider theme={theme ? darkTheme : lightTheme}>
            <Container style={{ marginTop: '20px' }}>
                {Object.keys(coinRes)?.length ? <Grid container spacing={3}>
                    <Grid item sm={12} lg={4}>
                        <div style={{ textAlign: 'center' }} className='imgWrapChart'>
                            <img src={coinRes.image.large} alt={coinRes.name} height="200" style={{ marginBottom: '20px' }} />
                            <h3 style={{ fontSize: '24px', color: 'gold' }}>{coinRes.name}</h3>
                            <h6 style={{ fontSize: '18px' }}>{formatDescription(coinRes.description.en)}</h6>
                            <h5 style={styleText}>Rank : {coinRes.market_cap_rank}</h5>
                            <h5 style={styleText}>Current Price: {coinRes.market_data.current_price.inr}</h5>
                            <h5 style={styleText}>Market Cap: {coinRes.market_data.market_cap.inr?.toString().slice(0, 6)}</h5>
                        </div>
                    </Grid>
                    <Grid item sm={12} lg={8}>
                        <Line datasetIdKey='id' data={chartData} />
                        <div className='buttonWrapper' style={buttonStyle}>
                            <Button
                                variant="contained"
                                onClick={() => handleButtonClick("1")}
                            >24 Hours</Button>
                            <Button
                                variant="contained"
                                onClick={() => handleButtonClick("30")}
                            >30 Days</Button>
                            <Button
                                variant="contained"
                                onClick={() => handleButtonClick("90")}>
                                3 Months</Button>
                            <Button
                                variant="contained"
                                onClick={() => handleButtonClick("365")}>
                                1 Year</Button>
                        </div>
                    </Grid>
                </Grid> : <LinearProgress color="secondary" />}
            </Container>
        </ThemeProvider>
    )
}

export default CoinPage;