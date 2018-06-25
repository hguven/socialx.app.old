import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme/';

const style: any = {
	container: {
		flex: 1,
		alignItems: 'center',
	},
	slideImage: {
		width: '100%',
		height: Sizes.smartHorizontalScale(275),
	},
	textContainer: {
		paddingHorizontal: Sizes.smartHorizontalScale(20),
	},
	slideTitle: {
		...Fonts.centuryGothicBold,
		fontSize: Sizes.smartHorizontalScale(42),
		color: Colors.white,
		textAlign: 'center',
		paddingVertical: Sizes.smartVerticalScale(20),
	},
	slideDescription: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(18),
		color: Colors.white,
		textAlign: 'center',
		paddingTop: Sizes.smartVerticalScale(10),
	},
};

export default StyleSheet.create(style);