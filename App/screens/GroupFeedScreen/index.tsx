// TODO: this is pretty outdated and will need refactoring before data hook!

import {IWallPostCardProp, TitleWithSubtitle} from 'components/Displayers';
import {OS_TYPES} from 'consts';
import React, {Component} from 'react';
import {Platform} from 'react-native';
import {NavigationScreenProp, NavigationStackScreenOptions} from 'react-navigation';
import {Colors, Images} from 'theme';
import {NewWallPostData} from '../NewWallPostScreen';
import GroupFeedScreenComponent from './screen';

const USER_FULL_NAME = 'Marcel Füssinger';

const INITIAL_USER_POSTS = [
	{
		text:
			'This is a very long text that will be truncated and only the first 3 lines will be displayed. ' +
			'Then ellipsis will show to indicate that more text is hidden. ' +
			'To a general advertiser outdoor advertising is worthy of consideration',
		smallAvatar: 'https://s.yimg.com/pw/images/buddyicon00.png',
		fullName: 'Tom Thompson',
		timestamp: new Date('Jan 20 2018'),
		numberOfLikes: 20,
		numberOfSuperLikes: 4,
		numberOfComments: 3,
		numberOfWalletCoins: 5,
	},
	{
		title: 'Post title',
		text: 'Hey, my first post to SocialX network!',
		taggedFriends: [{fullName: 'Isabelle Wilson'}, {fullName: 'Teddy Decola'}, {fullName: 'Michiko Bisson'}],
		location: 'Panselelor 47, Timisoara',
		smallAvatar: 'https://placeimg.com/120/120/people',
		fullName: 'Ionut Movila',
		timestamp: new Date('Jun 17 2017'),
		numberOfLikes: 11,
		numberOfSuperLikes: 6,
		numberOfComments: 4,
		numberOfWalletCoins: 2,
	},
];

interface IGroupFeedScreenProps {
	navigation: NavigationScreenProp<any>;
}

interface IGroupFeedScreenState {
	groupPosts: IWallPostCardProp[];
	refreshing: boolean;
}

export default class GroupScreen extends Component<IGroupFeedScreenProps, IGroupFeedScreenState> {
	private static navigationOptions: Partial<NavigationStackScreenOptions> = {
		headerTitle: <TitleWithSubtitle title={'TESTGROUP'} subtitle={'Some subtitle example text'} />,
		headerStyle: {
			backgroundColor: Colors.pink,
			height: Platform.OS === OS_TYPES.IOS ? 52 : 54,
		},
	};

	public state = {
		groupPosts: INITIAL_USER_POSTS,
		refreshing: false,
	};

	public render() {
		return (
			<GroupFeedScreenComponent
				refreshing={this.state.refreshing}
				refreshData={this.refreshGroupPosts}
				fullName={USER_FULL_NAME}
				avatarImage={Images.user_avatar_placeholder}
				groupPosts={this.state.groupPosts}
				loadMorePosts={this.loadMorePostsHandler}
				addGroupPost={this.addGroupPostHandler}
				showNewGroupPostPage={this.showNewGroupPostPage}
			/>
		);
	}

	private showNewGroupPostPage = () => {
		this.props.navigation.navigate('NewWallPostScreen', {
			fullName: USER_FULL_NAME,
			avatarImage: Images.user_avatar_placeholder,
			postCreate: this.addGroupPostHandler,
		});
	};

	private loadMorePostsHandler = () => {
		this.setState({
			groupPosts: [...this.state.groupPosts, ...INITIAL_USER_POSTS],
		});
	};

	private addGroupPostHandler = (data: NewWallPostData) => {
		const newPost: IWallPostCardProp = {
			text: data.text,
			smallAvatar: 'https://placeimg.com/110/110/people',
			fullName: 'Ionut Movila',
			timestamp: new Date(),
			numberOfLikes: 0,
			numberOfSuperLikes: 0,
			numberOfComments: 0,
			numberOfWalletCoins: 0,
		};
		this.setState({
			groupPosts: [newPost, ...this.state.groupPosts],
		});
	};

	private refreshGroupPosts = () => {
		this.setState({
			refreshing: true,
		});
		setTimeout(() => {
			this.setState({
				refreshing: false,
				groupPosts: INITIAL_USER_POSTS,
			});
		}, 1500);
	};
}
