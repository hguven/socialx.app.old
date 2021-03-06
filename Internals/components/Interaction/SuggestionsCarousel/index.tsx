import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import styles from './style';
import {SuggestionCard} from './SuggestionCard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ITEM_WIDTH = (45 / 100) * SCREEN_WIDTH;

export interface ISuggestionCardItem {
	userId: string;
	name: string;
	username: string;
	avatarURL: string;
	friend: boolean;
}

interface ISuggestionsCarouselProps {
	items: ISuggestionCardItem[];
}

interface ISuggestionsCarouselState {
	items: ISuggestionCardItem[];
}

export class SuggestionsCarousel extends Component<ISuggestionsCarouselProps, ISuggestionsCarouselState> {
	public static getDerivedStateFromProps(props: ISuggestionsCarouselProps, state: ISuggestionsCarouselState) {
		if (props.items && state.items.length === 0) {
			return {
				items: props.items,
			};
		}

		return null;
	}

	public state = {
		items: [],
	};

	public render() {
		return (
			<View style={styles.container}>
				<Text style={styles.header}>Suggestions for you</Text>
				<Carousel
					data={this.state.items}
					renderItem={this.renderItem}
					sliderWidth={SCREEN_WIDTH}
					itemWidth={ITEM_WIDTH}
					enableSnap={false}
					enableMomentum={true}
					decelerationRate={0.9}
					activeSlideAlignment='start'
					inactiveSlideScale={1}
					inactiveSlideOpacity={1}
					containerCustomStyle={styles.carouselContainer}
				/>
			</View>
		);
	}

	private renderItem = (data: {item: ISuggestionCardItem; index: number}) => {
		return <SuggestionCard item={data.item} deleteCard={() => this.deleteCard(data.index)} />;
	};

	private deleteCard = (cardIndex: number) => {
		console.log('cardIndex', cardIndex);
		const newItems = this.state.items.filter((item: ISuggestionCardItem, index: number) => index !== cardIndex);
		console.log(newItems);
		this.setState({items: newItems});
	};
}
