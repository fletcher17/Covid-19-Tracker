import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';


const InfoBox = ({title, cases, total}) => {
	return (
		<Card className='infoBox'>
		   <CardContent>
		{/* Titlte i.e Coronavirus cases */}
		<Typography className='infoBox__title' color='textSecondary'>{title}</Typography>
		{/* +120 Number of cases */}
		<h2>{cases}</h2>
		{/* 1.2M total cases */}
		<Typography className='infoBox__total' color='textSecondary'>{total}</Typography>
		   </CardContent>
		</Card>

		)
}

export default InfoBox;