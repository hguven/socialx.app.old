import React, {Component} from 'react';
import {Image, Keyboard, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import {ActionSheet} from 'native-base';
import ImagePicker, {Image as PickerImage} from 'react-native-image-crop-picker';
import Video from 'react-native-video';
import {NavigationScreenProp} from 'react-navigation';
import {AvatarImage} from '../../components/AvatarImage';
import {ButtonSizes, SXButton} from '../../components/Button';
import {ModalCloseButton} from '../../components/ModalCloseButton';
import {SXTextInput} from '../../components/TextInput';
import {Colors, Icons, Sizes} from '../../theme';
import style from './style';

const PICK_FROM_GALLERY = 'Pick from gallery';
const TAKE_A_PHOTO = 'Take a photo/video';
const CANCEL = 'Cancel';
const ACTION_SHEET_TITLE = 'Add media file';

const DEFAULT_MARGIN_BOTTOM = Sizes.smartVerticalScale(20);

export enum MediaTypes {
	Image = 'image',
	Video = 'video',
}

export interface MediaObject {
	path: string;
	type: MediaTypes;
}

export interface NewWallPostData {
	text: string;
	mediaObjects: MediaObject[];
}

interface INewWallPostScreenProps {
	navigation: NavigationScreenProp<any>;
}

interface INewWallPostScreenState {
	marginBottom: number;
	mediaObjects: MediaObject[];
	postText: string;
}

export class NewWallPostScreen extends Component<INewWallPostScreenProps, INewWallPostScreenState> {
	private static navigationOptions = (props: INewWallPostScreenProps) => ({
		title: 'MESSAGE',
		headerRight: <ModalCloseButton navigation={props.navigation} />,
		headerLeft: null,
	})

	public state = {
		marginBottom: DEFAULT_MARGIN_BOTTOM,
		mediaObjects: [] as MediaObject[],
		postText: '',
	};

	private keyboardDidShowListener: any;

	public componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
	}

	public componentWillUnmount() {
		this.keyboardDidShowListener.remove();
	}

	public render() {
		const {avatarImage, fullName} = this.props.navigation.state.params;
		return (
			<View style={[style.container, {paddingBottom: this.state.marginBottom}]}>
				<View style={style.topContainer}>
					<AvatarImage image={avatarImage} style={style.avatarImage} />
					<Text style={style.fullName}>{fullName}</Text>
				</View>
				<View style={style.inputContainer}>
					<SXTextInput
						value={this.state.postText}
						numberOfLines={3}
						borderColor={Colors.dustWhite}
						placeholder={'Type a message'}
						autoFocus={true}
						onChangeText={this.updatePostText}
					/>
				</View>
				<TouchableOpacity style={style.addMediaButton} onPress={this.addMediaHandler}>
					<Image source={Icons.iconNewPostAddMedia} style={style.photoIcon} resizeMode={'contain'} />
					<Text style={style.addMediaText}>{'Attach Photo/Video'}</Text>
				</TouchableOpacity>
				<ScrollView style={style.photosContainer} horizontal={true}>
					{this.renderPostMediaObjects()}
				</ScrollView>
				<SXButton
					label={'SEND'}
					size={ButtonSizes.Small}
					width={Sizes.smartHorizontalScale(100)}
					onPress={this.sendPostHandler}
				/>
			</View>
		);
	}

	private keyboardDidShow = (event: any) => {
		this.setState({
			marginBottom: event.endCoordinates.height + DEFAULT_MARGIN_BOTTOM / 2,
		});
	}

	private addMediaHandler = () => {
		ActionSheet.show(
			{
				options: [PICK_FROM_GALLERY, TAKE_A_PHOTO, CANCEL],
				cancelButtonIndex: 2,
				title: ACTION_SHEET_TITLE,
			},
			(buttonIndex: number) => {
				switch (buttonIndex) {
					case 0:
						this.showGalleryPhotoPicker();
						break;
					case 1:
						this.takeCameraPhoto();
						break;
				}
			},
		);
	}

	private showGalleryPhotoPicker = async () => {
		const image: PickerImage | PickerImage[] = await ImagePicker.openPicker({
			cropping: false,
			mediaType: 'any',
		});
		this.addNewMediaObject(image as PickerImage);
	}

	private takeCameraPhoto = async () => {
		const image: PickerImage | PickerImage[] = await ImagePicker.openCamera({
			cropping: false,
			mediaType: 'any',
			useFrontCamera: false,
		});
		this.addNewMediaObject(image as PickerImage);
	}

	private addNewMediaObject = (image: PickerImage) => {
		const { mediaObjects } = this.state;
		const mediaMimeType = image.mime;
		const localImagePath: MediaObject = {
			path: (image as PickerImage).path,
			type: mediaMimeType.startsWith(MediaTypes.Video) ? MediaTypes.Video : MediaTypes.Image,
		};
		this.setState({
			mediaObjects: mediaObjects.concat([ localImagePath ]),
		});
	}

	private renderPostMediaObjects = () => {
		const ret: any = [];
		this.state.mediaObjects.forEach((mediaObject: MediaObject, index) => {
			if (mediaObject.type === MediaTypes.Video) {
				ret.push(
					<Video
						key={index}
						source={{uri: 'file://' + mediaObject.path}}
						resizeMode={'cover'}
						paused={true}
						style={style.mediaObject}
					/>,
				);
			} else {
				ret.push(
					<Image
						key={index}
						source={{uri: 'file://' + mediaObject.path}}
						resizeMode={'cover'}
						style={style.mediaObject}
					/>,
				);
			}
		});
		return ret;
	}

	private sendPostHandler = () => {
		const wallPostData: NewWallPostData = {
			text: this.state.postText,
			mediaObjects: this.state.mediaObjects,
		};
		this.props.navigation.state.params.postCreate(wallPostData);
		this.props.navigation.goBack();
	}

	private updatePostText = (text: string) => {
		this.setState({postText: text});
	}
}