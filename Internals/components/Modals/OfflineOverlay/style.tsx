import {StyleSheet} from 'react-native';
import {Colors, colorWithAlpha, Fonts, Sizes} from 'theme';

const style: any = {
	container: {
		justifyContent: 'flex-start',
	},
	boxContainer: {
		flexDirection: 'row',
		maxWidth: 400,
		backgroundColor: colorWithAlpha(Colors.black, 0.7),
		paddingVertical: Sizes.smartHorizontalScale(20),
		paddingHorizontal: Sizes.smartHorizontalScale(20),
		borderRadius: Sizes.smartHorizontalScale(10),
		alignItems: 'center',
	},
	message: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(16),
		color: Colors.white,
		paddingLeft: Sizes.smartHorizontalScale(15),
	},
};

export default StyleSheet.create(style);
