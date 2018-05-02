import {Icons} from 'theme';

export enum FormTypes {
	Input,
	AvatarPicker,
	Checkbox,
}

export enum DeviceOrientations {
	Portrait = 'PORTRAIT',
	Landscape = 'LANDSCAPE',
	Uknown = 'UNKNOWN',
	Upsidedown = 'PORTRAITUPSIDEDOWN',
}

export const AndroidType = 'android';
export const IosType = 'ios';

export const OS_TYPES = {
	IOS: 'ios',
	Android: 'android',
};

export enum CoinSymbol {
	// here the values are in sync with CoinIcons & CoinFullName keys
	SOCX = 'SOCX',
	ETH = 'ETH',
}

export enum CoinIcons {
	SOCX = Icons.socxCoinIcon,
	ETH = Icons.ethCoinIcon,
}

export enum CoinFullName {
	SOCX = 'SOCX',
	ETH = 'Ethereum',
}