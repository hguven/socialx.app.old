import React from 'react';
import {Image, Platform, StyleProp, Text, View, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as mime from 'react-native-mime-types';

import {IVideoOptions, TouchableWithDoublePress, VideoPlayer} from 'components';
import {OS_TYPES} from 'consts';
import {MediaTypeImage, MediaTypes, MediaTypeVideo} from 'types';
import {IWithTranslationProps, withTranslations} from 'utilities';
import style from './style';

export interface IMediaObjectViewerProps extends IVideoOptions, IWithTranslationProps {
	uri: string;
	style: StyleProp<ViewStyle>;
	resizeMode?: string | FastImage.ResizeMode;
	extension?: string;
	type?: MediaTypes;
	onPress?: () => void;
	onDoublePress?: () => void;
}

const getMimeType = (uri: string, type: MediaTypes | undefined, extension: string | undefined) => {
	if (type) {
		return type.key;
	} else if (mime.extensions[extension]) {
		return extension;
	} else if (extension) {
		return mime.lookup('.' + extension);
	}
	return mime.lookup(uri);
};

const MediaObjectViewerComponent: React.SFC<IMediaObjectViewerProps> = (props) => {
	const {uri, style: customStyle, resizeMode, extension, type, onPress, onDoublePress, getText} = props;
	const ImageComponent = Platform.OS === OS_TYPES.Android && uri.startsWith('https://') ? FastImage : Image;
	const mediaMimeType = getMimeType(uri, type, extension);

	return (
		<View>
			{!mediaMimeType && <Text>{getText('message.media.not.supported')}</Text>}
			{mediaMimeType &&
				mediaMimeType.startsWith(MediaTypeImage.key) && (
					<TouchableWithDoublePress
						onSinglePress={onPress}
						onDoublePress={onDoublePress}
						disabled={!onPress}
						style={customStyle}
					>
						<ImageComponent source={{uri}} resizeMode={resizeMode} style={style.photoStyle} resizeMethod={'resize'} />
					</TouchableWithDoublePress>
				)}
			{mediaMimeType &&
				mediaMimeType.startsWith(MediaTypeVideo.key) && (
					<VideoPlayer videoURL={uri} containerStyle={customStyle} {...props} />
				)}
		</View>
	);
};

MediaObjectViewerComponent.defaultProps = {
	resizeMode: 'cover',
};

export const MediaObjectViewer = withTranslations(MediaObjectViewerComponent);
