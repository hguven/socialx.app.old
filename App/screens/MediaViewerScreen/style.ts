import {StyleSheet} from 'react-native';
import {Colors, Fonts, Sizes} from 'theme';

const INFO_BUTTON_SIZE = Sizes.smartHorizontalScale(40);

const style: any = {
	safeView: {
		backgroundColor: Colors.midnight,
		flex: 1,
	},
	carouselContainer: {
		height: '100%',
		width: '100%',
	},
	carouselMediaObject: {
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	screenFooter: {
		zIndex: 2,
		position: 'absolute',
		width: '100%',
		bottom: 0,
	},
	paginationContainer: {
		alignItems: 'center',
		width: '100%',
		paddingBottom: Sizes.smartVerticalScale(10),
	},
	paginationText: {
		...Fonts.centuryGothic,
		fontSize: Sizes.smartHorizontalScale(16),
		color: Colors.dustWhite,
	},
	mediaInfoSection: {
		width: '100%',
		paddingBottom: Sizes.smartVerticalScale(20),
		paddingHorizontal: Sizes.smartHorizontalScale(15),
		flexDirection: 'row',
	},
	infoText: {
		...Fonts.centuryGothic,
		color: Colors.white,
		fontSize: Sizes.smartHorizontalScale(16),
	},
	infoIcon: {
		color: Colors.white,
		fontSize: Sizes.smartHorizontalScale(30),
	},
	infoButton: {
		position: 'absolute',
		width: INFO_BUTTON_SIZE,
		height: INFO_BUTTON_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
	closeButton: {
		position: 'absolute',
		right: 0,
		width: INFO_BUTTON_SIZE,
		height: INFO_BUTTON_SIZE,
		alignItems: 'center',
		justifyContent: 'center',
	},
};

export default StyleSheet.create(style);
