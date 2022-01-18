import React, { useState, useEffect } from 'react'
import { CssBaseline, Grid } from '@material-ui/core'

import { getPlacesData, getWeatherData } from './api'

import Header from './components/Header/Header'
import List from './components/List/List'
import Map from './components/Map/Map'

const App = () => {
    // Места
    const [places, setPlaces] = useState([])
    const [filteredPlaces, setFilteredPlaces] = useState([])

    // Погода
    const [weatherData, setWeatherData] = useState([])

    const [childClicked, setChildClicked] = useState(null)

    // Координаты
    const [coordinates, setCoordinates] = useState({})
    const [bounds, setBounds] = useState({})

    // Состояние индикатора загрузки
    const [isLoading, setIsLoading] = useState(false)

    // Для сортировки
    const [type, setType] = useState('restaurants')
    const [rating, setRating] = useState('')

    //Определение местоположения пользователя
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
            setCoordinates({ lat: latitude, lng: longitude })
        })
    }, [])

    //Отсортировать по рейтингу
    useEffect(() => {
        const filteredPlaces = places.filter((place) => place.rating > rating)
        setFilteredPlaces(filteredPlaces)
    }, [rating])

    //Загрузка мест&погоды исходя из координат
    useEffect(() => {
        if (bounds.sw && bounds.ne) {
            setIsLoading(true)

            getWeatherData(coordinates.lat, coordinates.lng).then((data) => {
                setWeatherData(data)
            })

            getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
                setPlaces(data?.filter((place) => place.name && place.num_reviews > 0))
                setFilteredPlaces([])
                setIsLoading(false)
            })
        }
    }, [type, bounds])

    console.log(places)
    console.log(filteredPlaces)

    return (
        <>
            <CssBaseline />
            <Header setCoordinates={setCoordinates} />
            <Grid container spacing={3} style={{ width: '100%' }}>
                <Grid item xs={12} md={4}>
                    <List
                        places={filteredPlaces.length ? filteredPlaces : places}
                        childClicked={childClicked}
                        isLoading={isLoading}
                        type={type}
                        setType={setType}
                        rating={rating}
                        setRating={setRating}
                    />
                </Grid>
                <Grid item xs={12} md={8}>
                    <Map
                        places={filteredPlaces.length ? filteredPlaces : places}
                        setCoordinates={setCoordinates}
                        setBounds={setBounds}
                        coordinates={coordinates}
                        setChildClicked={setChildClicked}
                        weatherData={weatherData}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default App
