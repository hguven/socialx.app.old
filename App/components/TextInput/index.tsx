import React, {Component} from 'react';
import {Keyboard, Text, TextInput, TextInputStatic, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Colors} from '../../theme/';
import style, {ICON_HEIGHT} from './style';

export enum TKeyboardKeys {
	default = 'default',
	numeric = 'numeric',
	emailAddress = 'email-address',
}

export enum TRKeyboardKeys {
	done = 'done',
	next = 'next',
	search = 'search',
	send = 'send',
	go = 'go',
	default = 'default',
}

export interface ISXTextInputProps {
	width?: number;
	icon?: string;
	iconColor?: string;
	placeholder?: string;
	placeholderColor?: string;
	disabled?: boolean;
	isPassword?: boolean;
	keyboardType?: TKeyboardKeys;
	returnKeyType?: TRKeyboardKeys;
	cancelButtonTextColor?: string;
	canCancel?: boolean;
	onSubmitPressed?: () => void;
	onChangeText?: (value: string) => void;
	hasFocus?: boolean;
	blurOnSubmit?: boolean;
	borderColor?: string;
	numberOfLines?: number;
	value?: string;
}

export interface ISXTextInputState {
	hasFocus: boolean;
	textValue: string;
}

export class SXTextInput extends Component<ISXTextInputProps, ISXTextInputState> {
	public static defaultProps: Partial<ISXTextInputProps> = {
		width: 0,
		icon: '',
		iconColor: Colors.darkGray,
		placeholder: '',
		placeholderColor: Colors.grayText,
		disabled: false,
		isPassword: false,
		keyboardType: TKeyboardKeys.default,
		returnKeyType: TRKeyboardKeys.default,
		cancelButtonTextColor: Colors.white,
		canCancel: false,
		hasFocus: false,
		blurOnSubmit: false,
		borderColor: Colors.pink,
		numberOfLines: 1,
		value: '',
	};

	public state = {
		hasFocus: false,
		textValue: 'value' in this.props ? this.props.value : '',
	};

	private inputComponent: any;

	public render() {
		return (
			<View style={this.getContainerStyles()}>
				<View style={[style.inputContainer, {borderColor: this.props.borderColor}]}>
					{this.renderInputIcon()}
					{/* allowFontScaling={false} => does not exist */}
					<TextInput
						value={this.state.textValue}
						onChangeText={this.textChangedHandler}
						onSubmitEditing={this.props.onSubmitPressed}
						ref={(component: any) => (this.inputComponent = component)}
						onFocus={() => this.updateFocusHandler(true)}
						onBlur={() => this.updateFocusHandler(false)}
						returnKeyType={this.props.returnKeyType}
						editable={!this.props.disabled}
						secureTextEntry={this.props.isPassword}
						keyboardType={this.props.keyboardType}
						style={style.textInput}
						placeholder={this.props.placeholder}
						placeholderTextColor={this.props.placeholderColor}
						autoCorrect={false}
						underlineColorAndroid={Colors.transparent}
						autoCapitalize='none'
						clearButtonMode='while-editing' // only works on iOS
						blurOnSubmit={this.props.blurOnSubmit}
						numberOfLines={this.props.numberOfLines}
						multiline={this.props.numberOfLines > 1}
					/>
				</View>
				{this.renderCancelButton()}
			</View>
		);
	}

	public focusInput = () => {
		if (this.inputComponent) {
			this.inputComponent.focus();
		}
	}

	private getContainerStyles = () => {
		const ret: any = [style.container];
		if (this.props.width) {
			ret.push({width: this.props.width});
		}
		if (this.props.disabled) {
			ret.push(style.disabledInput);
		}
		return ret;
	}

	private renderInputIcon = () => {
		if (this.props.icon) {
			return (
				<View style={style.iconContainer}>
					<Icon name={this.props.icon} size={ICON_HEIGHT} color={this.props.iconColor} />
				</View>
			);
		}
		return null;
	}

	private renderCancelButton = () => {
		if (this.state.hasFocus && this.props.canCancel) {
			return (
				<TouchableOpacity style={style.cancelButton} onPress={() => Keyboard.dismiss()}>
					<Text style={[style.cancelButtonText, {color: this.props.cancelButtonTextColor}]}>Cancel</Text>
				</TouchableOpacity>
			);
		}
		return null;
	}

	private updateFocusHandler = (value: boolean) => {
		this.setState({
			hasFocus: value,
		});
	}

	private textChangedHandler = (value: string) => {
		this.setState({textValue: value});
		if (this.props.onChangeText) {
			this.props.onChangeText(value);
		}
	}
}
