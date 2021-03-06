import {StyleSheet} from 'react-native';
import {Colors, Sizes} from 'theme';

const styles: any = {
	container: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginTop: Sizes.smartVerticalScale(10),
		paddingTop: Sizes.smartVerticalScale(5),
		marginHorizontal: Sizes.smartHorizontalScale(15),
		borderTopWidth: 0.5,
		borderColor: Colors.grayNurse,
	},
	icon: {
		fontSize: Sizes.smartHorizontalScale(24),
		paddingBottom: Sizes.smartHorizontalScale(4),
		color: Colors.black,
	},
};

export default StyleSheet.create(styles);
