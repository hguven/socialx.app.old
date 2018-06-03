import {AvatarImage} from 'components/Avatar';
import {AddFriendsList} from 'components/Displayers/AddFriendsList';
import {CheckboxButtonWithIcon} from 'components/Displayers/CheckboxButtonWithIcon';
import {MediaObjectViewer} from 'components/Displayers/MediaObject';
import {IWithLoaderProps, withInlineLoader} from 'hoc/InlineLoader';
import React, {Component} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {Image as PickerImage} from 'react-native-image-crop-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Colors, Icons} from 'theme/';
import {FriendsSearchResult, WallPostPhoto} from './index';
import style from './style';

interface IPhotoScreenComponentProps extends IWithLoaderProps {
	avatarURL: string;
	mediaObject: PickerImage;
	showTagFriendsModal: () => void;
	taggedFriends: FriendsSearchResult[];
}

interface IPhotoScreenComponentState {
	locationEnabled: boolean;
	tagFriends: boolean;
	textEnabled: boolean;
	title: string;
	location: string;
	text: string;
}

class PhotoScreenComponent extends Component<IPhotoScreenComponentProps, IPhotoScreenComponentState> {
	public state = {
		locationEnabled: false,
		tagFriends: false,
		textEnabled: false,
		title: '',
		location: '',
		text: '',
	};

	public getWallPostData = (): Partial<WallPostPhoto> => {
		const ret: Partial<WallPostPhoto> = {
			includeTaggedFriends: this.state.tagFriends,
		};
		if (this.state.title !== '') {
			ret.title = this.state.title;
		}
		if (this.state.locationEnabled && this.state.location !== '') {
			ret.location = this.state.location;
		}
		if (this.state.textEnabled && this.state.text !== '') {
			ret.text = this.state.text;
		}
		return ret;
	};

	public render() {
		return this.props.renderWithLoader(
			<KeyboardAwareScrollView
				style={style.scrollView}
				alwaysBounceVertical={true}
				keyboardShouldPersistTaps={'handled'}
			>
				<View style={style.shareMessageContainer}>
					<AvatarImage image={{uri: this.props.avatarURL}} style={style.avatarImage} />
					<View style={style.captionContainer}>
						<TextInput
							autoFocus={true}
							autoCorrect={true}
							underlineColorAndroid={Colors.transparent}
							numberOfLines={1}
							multiline={true}
							placeholder={'Write a caption...'}
							style={style.captionTextInput}
							value={this.state.title}
							onChangeText={(value: string) => this.textChangedHandler('title', value)}
						/>
					</View>
				</View>
				<View style={style.photoContainer}>
					<MediaObjectViewer uri={this.props.mediaObject.path} style={style.photo} />
				</View>
				<View style={style.paddingContainer}>
					{this.renderLocationSection()}
					{this.renderTagFriendsSection()}
					{this.renderDescriptionSection()}
				</View>
			</KeyboardAwareScrollView>,
		);
	}

	private renderLocationSection = () => {
		return (
			<View style={style.checkboxButtonContainer}>
				<CheckboxButtonWithIcon
					iconSource={Icons.iconLocationPin}
					selected={this.state.locationEnabled}
					text={'ADD LOCATION'}
					onPress={this.toggleLocationHandler}
				/>
				{this.renderAddLocation()}
			</View>
		);
	};

	private renderAddLocation = () => {
		if (this.state.locationEnabled) {
			return (
				<View>
					<Text style={style.smallText}>{'Add location'}</Text>
					<View style={style.withMaxHeight}>
						<TextInput
							autoFocus={true}
							autoCorrect={true}
							underlineColorAndroid={Colors.transparent}
							numberOfLines={2}
							multiline={true}
							style={style.multilineTextInput}
							value={this.state.location}
							onChangeText={(value: string) => this.textChangedHandler('location', value)}
						/>
					</View>
				</View>
			);
		}
		return null;
	};

	private renderTagFriendsSection = () => {
		return (
			<View style={style.checkboxButtonContainer}>
				<CheckboxButtonWithIcon
					iconSource={Icons.iconInviteFriends}
					selected={this.state.tagFriends}
					text={'TAG FRIENDS'}
					onPress={this.toggleTagFriendsHandler}
				/>
				{this.renderAddTagFriends()}
			</View>
		);
	};

	private renderAddTagFriends = () => {
		if (this.state.tagFriends) {
			// todo @serkan @jake this is unused???
			const taggedFriendsForRender = [];
			for (const taggedFriend of this.props.taggedFriends) {
				taggedFriendsForRender.push(
					<Image
						key={taggedFriend.id}
						source={{uri: taggedFriend.avatarURL}}
						resizeMode={'cover'}
						style={style.taggedFriendIcon}
					/>,
				);
			}
			return (
				<AddFriendsList taggedFriends={this.props.taggedFriends} showTagFriendsModal={this.props.showTagFriendsModal} />
			);
		}
		return null;
	};

	private renderDescriptionSection = () => {
		return (
			<View style={style.checkboxButtonContainer}>
				<CheckboxButtonWithIcon
					iconSource={Icons.iconAddDescription}
					selected={this.state.textEnabled}
					text={'ADD DESCRIPTION'}
					onPress={this.toggleDescriptionEnabledHandler}
				/>
				{this.renderAddDescription()}
			</View>
		);
	};

	private renderAddDescription = () => {
		if (this.state.textEnabled) {
			return (
				<View>
					<Text style={style.smallText}>{'Add description'}</Text>
					<View style={style.withMaxHeight}>
						<TextInput
							autoFocus={true}
							autoCorrect={true}
							underlineColorAndroid={Colors.transparent}
							numberOfLines={2}
							multiline={true}
							style={style.multilineTextInput}
							value={this.state.text}
							onChangeText={(value: string) => this.textChangedHandler('text', value)}
						/>
					</View>
				</View>
			);
		}
		return null;
	};

	private toggleLocationHandler = () => {
		this.setState({
			locationEnabled: !this.state.locationEnabled,
		});
	};

	private toggleTagFriendsHandler = () => {
		this.setState({
			tagFriends: !this.state.tagFriends,
		});
	};

	private toggleDescriptionEnabledHandler = () => {
		this.setState({
			textEnabled: !this.state.textEnabled,
		});
	};

	private textChangedHandler = (inputStateVar: string, value: string) => {
		const newState: any = {};
		newState[inputStateVar] = value;
		this.setState(newState);
	};
}

export default withInlineLoader(PhotoScreenComponent, true);
