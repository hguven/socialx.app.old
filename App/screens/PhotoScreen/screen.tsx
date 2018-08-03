import React from 'react';
import {Text, TextInput, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {compose} from 'recompose';

import {AddFriendsList, CheckboxButtonWithIcon, MediaObjectViewer, SharePostInput} from 'components';
import {IWithLoaderProps, withInlineLoader} from 'hoc';
import {Colors, Icons} from 'theme';
import {FriendsSearchResult} from 'types';
import {IWithTranslationProps, PickerImage, withTranslations} from 'utilities';
import style from './style';

interface IPhotoScreenComponentProps extends IWithLoaderProps, IWithTranslationProps {
	avatarURL: string;
	mediaObject: PickerImage;
	showTagFriendsModal: () => void;
	taggedFriends: FriendsSearchResult[];
	locationEnabled: boolean;
	tagFriends: boolean;
	location: string;
	onLocationToggle: () => void;
	onLocationTextUpdate: (value: string) => void;
	onTagFriendsToggle: () => void;
	shareText: string;
	onShareTextUpdate: (value: string) => void;
}

interface ILocationSectionProps {
	locationEnabled: boolean;
	onLocationToggle: () => void;
	onLocationTextUpdate: (value: string) => void;
	checkboxLabel: string;
	locationLabel: string;
}

const LocationSection: React.SFC<ILocationSectionProps> = ({
	locationEnabled,
	onLocationToggle,
	onLocationTextUpdate,
	locationLabel,
	checkboxLabel,
}) => (
	<View style={style.checkboxButtonContainer}>
		<CheckboxButtonWithIcon
			iconSource={Icons.iconLocationPin}
			selected={locationEnabled}
			text={checkboxLabel}
			onPress={onLocationToggle}
		/>
		{locationEnabled && (
			<View>
				<Text style={style.smallText}>{locationLabel}</Text>
				<View style={style.withMaxHeight}>
					<TextInput
						autoFocus={true}
						autoCorrect={true}
						underlineColorAndroid={Colors.transparent}
						numberOfLines={2}
						multiline={true}
						style={style.multilineTextInput}
						onChangeText={onLocationTextUpdate}
					/>
				</View>
			</View>
		)}
	</View>
);

interface ITagFriendsSectionProps {
	tagFriends: boolean;
	onTagFriendsToggle: () => void;
	taggedFriends: FriendsSearchResult[];
	showTagFriendsModal: () => void;
	checkboxLabel: string;
}

const TagFriendsSection: React.SFC<ITagFriendsSectionProps> = ({
	onTagFriendsToggle,
	tagFriends,
	taggedFriends,
	showTagFriendsModal,
	checkboxLabel,
}) => {
	return (
		<View style={style.checkboxButtonContainer}>
			<CheckboxButtonWithIcon
				iconSource={Icons.iconInviteFriends}
				selected={tagFriends}
				text={checkboxLabel}
				onPress={onTagFriendsToggle}
			/>
			{tagFriends && <AddFriendsList taggedFriends={taggedFriends} showTagFriendsModal={showTagFriendsModal} />}
		</View>
	);
};

const PhotoScreenComponent: React.SFC<IPhotoScreenComponentProps> = ({
	avatarURL,
	mediaObject,
	locationEnabled,
	onLocationToggle,
	onLocationTextUpdate,
	taggedFriends,
	onTagFriendsToggle,
	tagFriends,
	showTagFriendsModal,
	shareText,
	onShareTextUpdate,
	getText,
}) => (
	<KeyboardAwareScrollView style={style.scrollView} alwaysBounceVertical={true} keyboardShouldPersistTaps={'handled'}>
		<SharePostInput
			avatarSource={{uri: avatarURL}}
			placeholder={getText('photo.screen.share.input.placeholder')}
			text={shareText}
			onTextUpdate={onShareTextUpdate}
		/>
		<View style={style.photoContainer}>
			<MediaObjectViewer uri={mediaObject.path} style={style.photo} />
		</View>
		<View style={style.paddingContainer}>
			<LocationSection
				locationEnabled={locationEnabled}
				onLocationToggle={onLocationToggle}
				onLocationTextUpdate={onLocationTextUpdate}
				checkboxLabel={getText('photo.screen.location.checkbox')}
				locationLabel={getText('photo.screen.location.small.label')}
			/>
			<TagFriendsSection
				tagFriends={tagFriends}
				taggedFriends={taggedFriends}
				onTagFriendsToggle={onTagFriendsToggle}
				showTagFriendsModal={showTagFriendsModal}
				checkboxLabel={getText('photo.screen.tag.friends.checkbox')}
			/>
		</View>
	</KeyboardAwareScrollView>
);

export default compose(
	withInlineLoader,
	withTranslations,
)(PhotoScreenComponent as any);
