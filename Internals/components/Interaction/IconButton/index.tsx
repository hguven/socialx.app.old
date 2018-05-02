import {AnimatedImage} from 'configuration/animations';
import React, {Component} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import style from './style';

const PULSATE_PERIOD = 700;

export interface IIconButtonProps {
	label?: string;
	iconSource: number;
	onPress?: Func;
	iconStyle?: number;
	changeWithAnimation: boolean;
}

interface IIconButtonState {
	iconSource: number;
	animating: boolean;
	touchDisabled: boolean;
}

export class IconButton extends Component<IIconButtonProps, IIconButtonState> {
	public static defaultProps: Partial<IIconButtonProps> = {
		label: undefined,
		iconStyle: style.iconStyle,
		changeWithAnimation: false,
	};

	public static getDerivedStateFromProps(nextProps: IIconButtonProps, prevState: IIconButtonState) {
		const ret: Partial<IIconButtonState> = {};
		if (nextProps.iconSource !== prevState.iconSource) {
			ret.animating = false;
		}
		return ret;
	}

	public state = {
		iconSource: this.props.iconSource,
		animating: false,
		touchDisabled: false,
	};

	private animatedIcon: any | null = null;

	public render() {
		return (
			<TouchableOpacity
				style={style.container}
				disabled={!this.props.onPress || this.state.touchDisabled}
				onPress={this.buttonPressedHandler}
			>
				<AnimatedImage
					ref={(ref: any) => (this.animatedIcon = ref)}
					source={this.state.iconSource}
					style={this.props.iconStyle}
					resizeMode={'contain'}
				/>
				{this.props.label && <Text style={style.label}>{this.props.label}</Text>}
			</TouchableOpacity>
		);
	}

	private buttonPressedHandler = () => {
		if (this.props.changeWithAnimation) {
			this.animatedIcon.animate('pulsate', PULSATE_PERIOD).then(this.onAnimationEndHandler);
			this.setState({
				animating: true,
				touchDisabled: true,
			});
		}
		if (this.props.onPress) {
			this.props.onPress();
		}
	}

	private onAnimationEndHandler = () => {
		if (this.state.animating) {
			this.animatedIcon.animate('pulsate', PULSATE_PERIOD).then(this.onAnimationEndHandler);
		} else {
			this.setState({
				iconSource: this.props.iconSource,
				touchDisabled: false,
			});
		}
	}
}