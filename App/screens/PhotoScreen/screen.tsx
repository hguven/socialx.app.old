import React, {Component} from 'react';
import {Image, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AvatarImage} from '../../components/AvatarImage';
import {Colors, Icons} from '../../theme/';
import {CheckboxButtonWithIcon} from './CheckboxButtonWithIcon';
import {FriendsSearchResult, WallPostPhoto} from './index';
import style from './style';

interface IPhotoScreenComponentProps {
	avatarURL: string;
	localPhotoURL: string;
	showTagFriendsModal: () => void;
	taggedFriends: FriendsSearchResult[];
}

interface IPhotoScreenComponentState {
	locationEnabled: boolean;
	tagFriends: boolean;
	descriptionEnabled: boolean;
	caption: string;
	location: string;
	description: string;
}

export default class PhotoScreenComponent extends Component<IPhotoScreenComponentProps, IPhotoScreenComponentState> {
	public state = {
		locationEnabled: false,
		tagFriends: false,
		descriptionEnabled: false,
		caption: '',
		location: '',
		description: '',
	};

	public getWallPostData = (): Partial<WallPostPhoto> => {
		const ret: Partial<WallPostPhoto> = {
			includeTaggedFriends: this.state.tagFriends,
		};
		if (this.state.caption !== '') {
			ret.caption = this.state.caption;
		}
		if (this.state.locationEnabled && this.state.location !== '') {
			ret.location = this.state.location;
		}
		if (this.state.descriptionEnabled && this.state.description !== '') {
			ret.description = this.state.description;
		}
		return ret;
	}

	public render() {
		return (
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
							autoCorrect={false}
							underlineColorAndroid={Colors.transparent}
							autoCapitalize='none'
							numberOfLines={1}
							multiline={true}
							placeholder={'Write a caption...'}
							style={style.captionTextInput}
							value={this.state.caption}
							onChangeText={(value: string) => this.textChangedHandler('caption', value)}
						/>
					</View>
				</View>
				<View style={style.photoContainer}>
					<Image source={{uri: this.props.localPhotoURL}} resizeMode={'cover'} style={style.photo} />
				</View>
				<View style={style.paddingContainer}>
					{this.renderLocationSection()}
					{this.renderTagFriendsSection()}
					{this.renderDescriptionSection()}
				</View>
			</KeyboardAwareScrollView>
		);
	}

	private renderLocationSection = () => {
		return (
			<View>
				<CheckboxButtonWithIcon
					iconSource={Icons.iconLocationPin}
					selected={this.state.locationEnabled}
					text={'ADD LOCATION'}
					onPress={this.toggleLocationHandler}
				/>
				{this.renderAddLocation()}
			</View>
		);
	}

	private renderAddLocation = () => {
		if (this.state.locationEnabled) {
			return (
				<View>
					<Text style={style.smallText}>{'Add location'}</Text>
					<View style={style.withMaxHeight}>
						<TextInput
							autoFocus={true}
							autoCorrect={false}
							underlineColorAndroid={Colors.transparent}
							autoCapitalize='none'
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
	}

	private renderTagFriendsSection = () => {
		return (
			<View>
				<CheckboxButtonWithIcon
					iconSource={Icons.iconInviteFriends}
					selected={this.state.tagFriends}
					text={'TAG FRIENDS'}
					onPress={this.toggleTagFriendsHandler}
				/>
				{this.renderAddTagFriends()}
			</View>
		);
	}

	private renderAddTagFriends = () => {
		if (this.state.tagFriends) {
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
				<View style={style.tagFriendsContainer}>
					<ScrollView alwaysBounceHorizontal={false} horizontal={true} style={style.taggedFriendsScroll}>
						{taggedFriendsForRender}
					</ScrollView>
					<TouchableOpacity onPress={this.props.showTagFriendsModal} style={style.tagFriendsButton}>
						<Image source={Icons.tagFriendSmall} />
					</TouchableOpacity>
				</View>
			);
		}
		return null;
	}

	private renderDescriptionSection = () => {
		return (
			<View>
				<CheckboxButtonWithIcon
					iconSource={Icons.iconAddDescription}
					selected={this.state.descriptionEnabled}
					text={'ADD DESCRIPTION'}
					onPress={this.toggleDescriptionEnabledHandler}
				/>
				{this.renderAddDescription()}
			</View>
		);
	}

	private renderAddDescription = () => {
		if (this.state.descriptionEnabled) {
			return (
				<View>
					<Text style={style.smallText}>{'Add description'}</Text>
					<View style={style.withMaxHeight}>
						<TextInput
							autoFocus={true}
							autoCorrect={false}
							underlineColorAndroid={Colors.transparent}
							autoCapitalize='none'
							numberOfLines={2}
							multiline={true}
							style={style.multilineTextInput}
							value={this.state.description}
							onChangeText={(value: string) => this.textChangedHandler('description', value)}
						/>
					</View>
				</View>
			);
		}
		return null;
	}

	private toggleLocationHandler = () => {
		this.setState({
			locationEnabled: !this.state.locationEnabled,
		});
	}

	private toggleTagFriendsHandler = () => {
		this.setState({
			tagFriends: !this.state.tagFriends,
		});
	}

	private toggleDescriptionEnabledHandler = () => {
		this.setState({
			descriptionEnabled: !this.state.descriptionEnabled,
		});
	}

	private textChangedHandler = (inputStateVar: string, value: string) => {
		const newState: any = {};
		newState[inputStateVar] = value;
		this.setState(newState);
	}
}
