import {StyleSheet} from 'react-native';
import {Colors, Sizes} from 'theme';

const style: any = {
	safeView: {
		backgroundColor: Colors.pink,
	},
	headerContainer: {
		paddingBottom: Sizes.smartVerticalScale(7),
		paddingTop: Sizes.smartVerticalScale(3),
		width: '100%',
		paddingHorizontal: Sizes.smartHorizontalScale(8),
		flexDirection: 'row',
	},
	backIcon: {
		fontSize: Sizes.smartHorizontalScale(30),
		color: Colors.white,
		paddingLeft: Sizes.smartHorizontalScale(5),
		paddingRight: Sizes.smartHorizontalScale(13),
	},
	inputOverlay: {
		backgroundColor: Colors.transparent,
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
};

export default StyleSheet.create(style);
