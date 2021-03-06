import {storiesOf} from '@storybook/react-native';
import {AvatarPicker} from 'components/Avatar';
import React from 'react';
import {Colors, Images} from 'theme';
import CenterView from '../CenterView';

const containerStyle = {
	backgroundColor: Colors.white,
};

function afterImagePickHandler(path: string) {
	alert('Profile image with path: ' + 'file://' + path);
}

storiesOf('AvatarPicker', module)
	.addDecorator((getStory: any) => <CenterView style={containerStyle}>{getStory()}</CenterView>)
	.add('no update possible', () => {
		return (
			<AvatarPicker
				avatarImage={Images.user_avatar_placeholder}
				afterImagePick={afterImagePickHandler}
				avatarSize={103}
			/>
		);
	});
