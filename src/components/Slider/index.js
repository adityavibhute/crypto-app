import { Typography, Container, ThemeProvider } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Link } from 'react-router-dom';
import TableComponent from '../TableComponent';
import { darkTheme, lightTheme } from '../../themes';
import ThemeContext from '../../ThemeContext';
import imagePath from './bg-image-slider.jpeg';

const Slider = () => {
    const [TrendingData, setTrendingData] = useState([]);
    const {
        theme,
    } = useContext(ThemeContext);
    const responsive = {
        768: {
            items: 2,
        },
        1024: {
            items: 4,
            itemsFit: 'contain',
        }
    };

    const sliderWrapper = { 
        padding: '40px 0 40px 0',
        backgroundImage: `url(${imagePath})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
    }
    const flexStyle = {
        textAlign: 'center',
        fontSize: '24px',
        textTransform: 'uppercase',
        fontWeight: '600'
    };
    const isProfit = (percent) => {
        return percent > 0;
    }

    useEffect(() => {
        const fetchTrendingData = async () => {
            await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=INR&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h')
                .then((res) => res.json()).then((data) => setTrendingData(data))
                .catch((err) => {
                    console.log('error getting Trending data', err);
                });
        }
        fetchTrendingData();
    }, []);
    const generateItems = () => {
       const trends = TrendingData && TrendingData.map((item) => {
            return(
                <div style={flexStyle} key={item.name}>
                    <Link to={`/coins/${item.id}`}>
                        <img width={100} alt={item.name} src={item.image} role="presentation" />
                    </Link>
                    <p>{item.symbol} &nbsp;
                        <span style={{color: isProfit(item.price_change_percentage_24h_in_currency) ? 'green' : 'red'}}>
                            {isProfit(item.price_change_percentage_24h_in_currency) ? '+' : ''}{item.price_change_percentage_24h_in_currency.toFixed(2)}</span>
                    </p>
                    <p>₹{item.current_price.toFixed(2)}</p>
                </div>
            )
        });
        return trends;
    };

    return (
        <ThemeProvider theme={theme ? darkTheme : lightTheme}>
            <div style={sliderWrapper}>
                <Typography variant="h4" align="center" style={{ padding: '40px 0' }}>
                    Top Crypto Currency
                </Typography>
                {/* Add more Material-UI components here */}
                <AliceCarousel
                    mouseTracking
                    items={generateItems()}
                    autoPlay={true}
                    disableButtonsControls={true}
                    disableDotsControls={true}
                    responsive={responsive}
                />
            </div>
            <Container>
                <Typography variant="h4" align="center" style={{ padding: '40px 0' }}>
                    Currency price by Market Cap
                </Typography>
                <TableComponent />
            </Container>
        </ThemeProvider>
    )
};

export default Slider;