import React, { useState, useEffect} from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './Components/InfoBox/Infobox';
import Table from './Components/Table/Table';
import { sortData, prettyPrintStat } from './Components/util';
import LineGraph from './Components/LineGraph/LineGraph';
import Map from './Components/Map/Map';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');


useEffect(() => {
  fetch('https://disease.sh/v3/covid-19/all')
  .then((response) => response.json())
  .then((data) => {
    setCountryInfo (data);
  })
}, []);

useEffect (() => {
  const getCountriesData = async () => {
    await fetch('https://disease.sh/v3/covid-19/countries')
    .then((response) => response.json())
    .then((data) => {
      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setMapCountries(data);
      setCountries(countries);
    })
  };
    getCountriesData();
}, [countries]);


    const onCountryChange = async (event) => {
      const countryCode = event.target.value;

      const url =  
      countryCode === "worldwide" 
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);

        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
    })
  };

   return (
    <div className="app">
     <div className='app__left'>
      <div className='app__header'>
        <h1>covid19 tracker</h1>
        <FormControl className="app__dropdown">
          <Select variant='outlined' value={country} onChange={onCountryChange}>
          <MenuItem value='worldwide'>Worldwide</MenuItem>
           { 
            countries.map((country) => (
            <MenuItem value={country.value}>{country.name}</MenuItem>
            ))
         }
          </Select>
        </FormControl>
       </div>
        <div className='app__stats'>
          <InfoBox active={casesType === "cases"} isRed
          onClick={(e)=> setCasesType('cases')} title='coronavirus cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>
          <InfoBox active={casesType === "recovered"} onClick={(e)=> setCasesType('recovered')} title='coronavirus recoveries' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>
          <InfoBox active={casesType === "deaths"} isRed onClick={(e)=> setCasesType('deaths')} title='coronavirus deaths' cases={prettyPrintStat(countryInfo.cases)} total={prettyPrintStat(countryInfo.deaths)}/>
        </div>
          <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom}/>
      </div>
      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
              <Table countries={tableData}/>
          <h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
          <LineGraph className='app__graph' casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}
 

export default App;

