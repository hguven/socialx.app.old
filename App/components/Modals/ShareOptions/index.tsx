import React from 'react';
import {Platform, ScrollView, Tou, TouchableWithoutFeedback, View} from 'react-native';
import {BlurView} from 'react-native-blur';
import Modal from 'react-native-modal';
import {OS_TYPES} from '../../../constants';
import {withManagedTransitions} from '../../../hoc/ManagedModal';
import {Icons} from '../../../theme';
import {ShareOptionsButton} from '../../Interaction';
import style from './style';

const BUTTON_NAMES = {
	wallet: 'Wallet',
	camera: 'Camera',
	media: 'Media',
	audio: 'Audio',
	location: 'Location',
	contact: 'Contact',
};

interface IModalInvitePeopleProps {
	visible: boolean;
	walletHandlerPressed: Func;
	cameraHandlerPressed: Func;
	mediaHandlerPressed: Func;
	audioHandlerPressed: Func;
	locationHandlerPressed: Func;
	contactHandlerPressed: Func;
	closeHandler: Func;
	onDismiss: () => void;
	onModalHide: () => void;
}

const ModalShareOptionsSFC: React.SFC<IModalInvitePeopleProps> = (props) => {
	const renderOSBlurView = () => {
		if (Platform.OS === OS_TYPES.iOS) {
			return (
				<TouchableWithoutFeedback onPress={props.closeHandler}>
					<BlurView style={style.blurView} blurType='dark' blurAmount={2} />
				</TouchableWithoutFeedback>
			);
		}
		return null;
	};

	const backDropOpacity = Platform.OS === OS_TYPES.iOS ? 0 : 0.7;

	return (
		<Modal
			onDismiss={props.onDismiss}
			onModalHide={props.onModalHide}
			isVisible={props.visible}
			backdropOpacity={backDropOpacity}
			style={style.container}
			onBackButtonPress={props.closeHandler}
			onBackdropPress={props.closeHandler}
		>
			{renderOSBlurView()}
			<View style={style.boxContainer}>
				<View style={style.rowContainer}>
					<ShareOptionsButton
						iconSource={Icons.iconWallet}
						onPress={props.walletHandlerPressed}
						label={BUTTON_NAMES.wallet}
					/>
					<ShareOptionsButton
						iconSource={Icons.iconCamera}
						onPress={props.cameraHandlerPressed}
						label={BUTTON_NAMES.camera}
					/>
					<ShareOptionsButton
						iconSource={Icons.iconShareMedia}
						onPress={props.mediaHandlerPressed}
						label={BUTTON_NAMES.media}
					/>
				</View>
				<View style={style.rowContainer}>
					<ShareOptionsButton
						iconSource={Icons.iconSound}
						onPress={props.audioHandlerPressed}
						label={BUTTON_NAMES.audio}
					/>
					<ShareOptionsButton
						iconSource={Icons.iconLocation}
						onPress={props.locationHandlerPressed}
						label={BUTTON_NAMES.location}
					/>
					<ShareOptionsButton
						iconSource={Icons.iconPerson}
						onPress={props.contactHandlerPressed}
						label={BUTTON_NAMES.contact}
					/>
				</View>
			</View>
		</Modal>
	);
};

export const ModalShareOptions = withManagedTransitions(ModalShareOptionsSFC);