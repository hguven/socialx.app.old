import {OS_TYPES} from 'consts';
import {Platform, StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const INPUT_MIN_HEIGHT = Sizes.smartHorizontalScale(35);
const INPUT_CONTAINER_VERTICAL_PADDING = Sizes.smartVerticalScale(5);

const style: any = {
	inputContainer: {
		flexDirection: 'row',
		paddingHorizontal: Sizes.smartHorizontalScale(10),
		paddingVertical: INPUT_CONTAINER_VERTICAL_PADDING,
		borderTopColor: Colors.silverSand,
		borderTopWidth: 0.5,
		maxHeight: Sizes.smartVerticalScale(110),
	},
	textInput: {
		flex: 8,
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(16),
		color: Colors.postFullName,
		backgroundColor: Colors.dustWhite,
		borderRadius: Sizes.smartHorizontalScale(25),
		borderColor: Colors.silverSand,
		borderWidth: 0.5,
		paddingHorizontal: Sizes.smartHorizontalScale(15),
		minHeight: INPUT_MIN_HEIGHT,
		paddingVertical: Sizes.smartVerticalScale(5),
		paddingTop: Platform.OS === OS_TYPES.IOS ? Sizes.smartVerticalScale(7) : Sizes.smartVerticalScale(5),
		textAlignVertical: 'center',
	},
	sendButtonContainer: {
		flex: 1,
		justifyContent: 'flex-end',
	},
	sendButton: {
		paddingVertical: Platform.OS === OS_TYPES.Android ? Sizes.smartVerticalScale(5) : 0,
		paddingLeft: Sizes.smartHorizontalScale(10),
	},
};

export default StyleSheet.create(style);
