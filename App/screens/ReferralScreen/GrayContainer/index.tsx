import React from 'react';
import {Text, View} from 'react-native';

import styles from './style';

interface IGrayContainerProps {
	heading: string;
	text: string;
}

const GrayContainer: React.SFC<IGrayContainerProps> = ({heading, text}) => {
	return (
		<View style={styles.container}>
			<Text style={styles.heading}>{heading}</Text>
			<Text style={styles.text}>{text}</Text>
		</View>
	);
};

export default GrayContainer;
