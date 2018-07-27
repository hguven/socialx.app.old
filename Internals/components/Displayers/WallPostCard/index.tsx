import LottieView from 'lottie-react-native';
import moment from 'moment';
import React, {Component} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import {compose} from 'recompose';

import {blockUserHoc} from 'backend/graphql';
import {HeartAnimation} from 'components';
import {ModalManager} from 'hoc';
import {Colors, Sizes} from 'theme';
import {Icons} from 'theme/Icons';
import {IMediaProps, ISimpleComment, IUserQuery} from 'types';
import {getUserAvatar, getUserFullName, IWithTranslationProps, showToastMessage, withTranslations} from 'utilities';
import {IReportData, ModalReportProblem} from '../../Modals';
import {TooltipDots, TooltipItem} from '../DotsWithTooltips';
import style from './style';
import {WallPostActions} from './WallPostActions';
import {WallPostMedia} from './WallPostMedia';

import ParsedText from 'lib/textParser';

const POST_SHORT_LENGTH = 100;
const POST_SHORT_MAX_LINES = 3;

export interface ISimpleWallPostCardProps {
	id: string;
	text?: string;
	location?: string;
	taggedFriends?: Array<{
		// TODO: should be an array of IUserQuery
		fullName: string;
	}>;
	timestamp: Date;
	owner: IUserQuery;
	blockUser: any;
}

export interface IWallPostCardProp extends ISimpleWallPostCardProps, IWithTranslationProps {
	governanceVersion?: boolean;
	numberOfLikes?: number;
	numberOfSuperLikes?: number;
	numberOfComments?: number;
	numberOfWalletCoins?: number;
	onImageClick?: (index: number) => void;
	onLikeButtonClick?: () => Promise<any>;
	onDeleteClick?: (postId: string) => void;
	onUserClick?: (userId: string) => void;
	onCommentClick: (startComment: boolean) => void;
	likedByMe?: boolean;
	canDelete?: boolean;
	Media?: IMediaProps[];
	media?: IMediaProps[];
	likes?: any;
	bestComments: ISimpleComment[];
}

export interface IWallPostCardState {
	fullTextVisible: boolean;
	modalVisibleReportProblem: boolean;
	hideAdvancedMenu: boolean;
	hideGoToUserProfile: boolean;
	hidePostActionsAndComments: boolean;
	disableMediaFullScreen: boolean;
	animation: boolean;
}

class WallPostCardComp extends Component<IWallPostCardProp, IWallPostCardState> {
	public static defaultProps: Partial<IWallPostCardProp> = {
		canDelete: false,
		likedByMe: false,
		numberOfLikes: 0,
		numberOfSuperLikes: 0,
		numberOfComments: 0,
		numberOfWalletCoins: 0,
	};

	public state = {
		fullTextVisible: false,
		modalVisibleReportProblem: false,
		hideAdvancedMenu: this.props.governanceVersion || false,
		hideGoToUserProfile: this.props.governanceVersion || false,
		hidePostActionsAndComments: this.props.governanceVersion || false,
		disableMediaFullScreen: this.props.governanceVersion || false,
		animation: false,
	};

	public shouldComponentUpdate(
		nextProps: Readonly<IWallPostCardProp>,
		nextState: Readonly<IWallPostCardState>,
	): boolean {
		return (
			this.props.id !== nextProps.id ||
			this.props.numberOfLikes !== nextProps.numberOfLikes ||
			this.props.numberOfComments !== nextProps.numberOfComments ||
			this.state.modalVisibleReportProblem !== nextState.modalVisibleReportProblem ||
			this.state.fullTextVisible !== nextState.fullTextVisible ||
			this.state.animation !== nextState.animation
		);
	}

	public render() {
		return (
			<View style={style.container}>
				{this.renderModalReportProblem()}
				{this.renderUserDetails()}
				{this.renderPostText()}
				{this.renderWallPostMedia()}
				{this.renderWallPostActions()}
				{this.renderRecentLikes()}
				{this.renderNumberOfComments()}
				{this.renderTwoBestComments()}
			</View>
		);
	}

	private renderModalReportProblem = () => {
		if (!this.state.hideAdvancedMenu) {
			return (
				<ModalReportProblem
					visible={this.state.modalVisibleReportProblem}
					confirmHandler={this.reportProblemHandler}
					declineHandler={this.toggleDeclineReportModal}
				/>
			);
		}
		return null;
	};

	private renderUserDetails = () => {
		const timeStampDate = moment(this.props.timestamp).format('MMM DD');
		const timeStampHour = moment(this.props.timestamp).format('hh:mma');
		const avatarURL = getUserAvatar({user: this.props.owner});
		const fullName = getUserFullName(this.props.owner);
		return (
			<TouchableOpacity
				onPress={() => this.navigateToUserProfilePage(this.props.owner.userId)}
				style={style.topContainer}
				disabled={this.state.hideGoToUserProfile}
			>
				<FastImage source={{uri: avatarURL}} style={style.smallAvatarImage} />
				<View style={style.topRightContainer}>
					<Text style={style.fullName}>
						{fullName}
						{this.renderTaggedFriends()}
						{this.renderLocation()}
					</Text>
					<Text style={style.timestamp}>{`${timeStampDate} at ${timeStampHour}`}</Text>
				</View>
				{!this.state.hideAdvancedMenu && <TooltipDots items={this.getTooltipItems()} />}
			</TouchableOpacity>
		);
	};

	// todo @serkan @jake what???
	private renderTaggedFriends = () => {
		if (this.props.taggedFriends && this.props.taggedFriends.length > 0) {
			// prettier-ignore
			const ret = [
				(
					<Text style={style.grayText} key={0}>
						{' with '}
					</Text>
				),
				<Text key={1}>{this.props.taggedFriends[0].fullName}</Text>,
			];
			if (this.props.taggedFriends.length > 1) {
				ret.push(
					<Text style={style.grayText} key={2}>
						{' and '}
					</Text>,
				);
				ret.push(<Text key={3}>{`${this.props.taggedFriends.length - 1} others`}</Text>);
			}
			return ret;
		}
		return null;
	};

	private renderLocation = () => {
		if (this.props.location) {
			// prettier-ignore
			return [
				(
					<Text style={style.grayText} key={0}>
						{' at '}
					</Text>
				),
				(
					<Icon
						name={'md-pin'}
						size={Sizes.smartHorizontalScale(12)}
						color={Colors.postText}
						style={style.locationPin}
						key={1}
					/>
				),
				<Text key={2}>{' ' + this.props.location}</Text>,
			];
		}
		return null;
	};

	private tooltipsReportPressedHandler = () => {
		// @ionut TODO not working?
		ModalManager.safeRunAfterModalClosed(() => {
			this.setState({
				modalVisibleReportProblem: true,
			});
		});
	};

	private onDoubleTapLikeHandler = async () => {
		if (this.props.onLikeButtonClick) {
			if (this.props.likedByMe) {
				this.setState({animation: true});
			} else {
				this.setState({animation: true});
				await this.props.onLikeButtonClick();
			}
		}
	};

	private renderWallPostMedia = () => (
		<View>
			{this.state.animation && <HeartAnimation ended={(status) => this.setState({animation: !status})} />}
			<WallPostMedia
				mediaObjects={this.props.Media || this.props.media}
				onMediaObjectView={this.props.onImageClick}
				onLikeButtonPressed={this.onDoubleTapLikeHandler}
				noInteraction={this.state.disableMediaFullScreen}
			/>
		</View>
	);

	private renderPostText = () => {
		const postText = this.props.text;
		if (postText) {
			const numberOfLines = postText.split('\n').length;

			const hasMore =
				(postText.length > POST_SHORT_LENGTH || numberOfLines > POST_SHORT_MAX_LINES) && !this.state.fullTextVisible;

			let textToRender = postText;

			if (hasMore) {
				if (numberOfLines > POST_SHORT_MAX_LINES) {
					textToRender = textToRender
						.split('\n')
						.slice(0, POST_SHORT_MAX_LINES)
						.join('\n');
				}

				if (postText.length > POST_SHORT_LENGTH) {
					textToRender = textToRender.substr(0, POST_SHORT_LENGTH);
				}

				textToRender = textToRender + '...';
			}

			const showMoreButton = hasMore ? (
				<Text style={style.showMoreText} onPress={this.toggleShowFullText}>
					{'More'}
				</Text>
			) : null;

			return (
				<View style={style.postTextPadding}>
					<Text style={style.postText}>
						<ParsedText
							style={style.postText}
							childrenProps={{allowFontScaling: false}}
							parse={[
								{
									type: 'hashtag',
									style: style.hashtag,
									onPress: this.handleHashTag,
								},
								{
									type: 'tags',
									style: style.tag,
									onPress: this.handleUserTag,
								},
								{
									type: 'url',
									style: style.url,
									onPress: this.launchExternalURL,
								},
							]}
						>
							{textToRender}
						</ParsedText>
						{showMoreButton}
					</Text>
				</View>
			);
		}
		return null;
	};

	private renderWallPostActions = () => {
		if (!this.state.hidePostActionsAndComments) {
			return (
				<WallPostActions
					likedByMe={this.props.likedByMe}
					numberOfSuperLikes={this.props.numberOfSuperLikes}
					numberOfWalletCoins={this.props.numberOfWalletCoins}
					likeButtonPressed={this.props.onLikeButtonClick}
					superLikeButtonPressed={this.superLikeButtonPressedHandler}
					commentsButtonPressed={() => this.props.onCommentClick(true)}
					walletCoinsButtonPressed={this.walletCoinsButtonPressedHandler}
				/>
			);
		}
		return null;
	};

	private renderRecentLikes = () => {
		if (this.props.numberOfLikes && this.props.numberOfLikes > 0) {
			const {getText} = this.props;
			const lastLikeUser = this.props.likes[this.props.numberOfLikes - 1];
			const numberOfOtherLikes = this.props.numberOfLikes - 1;
			const secondLastLike = this.props.numberOfLikes >= 2 ? this.props.likes[this.props.numberOfLikes - 2] : null;
			const andText = ` ${getText('text.and')} `;
			return (
				<View style={style.recentLikesContainer}>
					<Text style={style.likedText}>
						{getText('post.card.liked.by') + ' '}
						<Text style={style.likeTextBold} onPress={() => this.navigateToUserProfilePage(lastLikeUser.userId)}>
							{lastLikeUser.userName}
						</Text>
					</Text>
					{numberOfOtherLikes === 1 && (
						<Text style={style.likedText}>
							{andText}
							<Text style={style.likeTextBold} onPress={() => this.navigateToUserProfilePage(secondLastLike.userId)}>
								{secondLastLike.userName}
							</Text>
						</Text>
					)}
					{numberOfOtherLikes > 1 && (
						<Text style={style.likedText}>
							{andText}
							<Text style={style.likeTextBold}>{numberOfOtherLikes + ' others'}</Text>
						</Text>
					)}
				</View>
			);
		}
		return null;
	};

	private blockUserHandler = async () => {
		const {userId} = this.props.owner;
		const {blockUser} = this.props;
		try {
			await blockUser({
				variables: {
					userId,
				},
			});
			showToastMessage('This user has been blocked..');
		} catch (ex) {
			showToastMessage(`There was a problem blocking this friend.  Please try again later... ${ex}`);
			console.log(`exception: ${ex}`);
		}
	};

	private renderNumberOfComments = () => {
		const {numberOfComments, getText} = this.props;
		if (numberOfComments && numberOfComments > 0) {
			return (
				<TouchableOpacity style={style.numCommentsContainer} onPress={() => this.props.onCommentClick(false)}>
					<Text style={style.viewAllCommentsText}>
						{getText('post.card.view.all.comments', this.props.numberOfComments)}
					</Text>
				</TouchableOpacity>
			);
		}
	};

	private renderTwoBestComments = () => {
		if (this.props.numberOfComments && this.props.numberOfComments > 0) {
			return (
				<View style={style.bestCommentsContainer}>
					{this.props.bestComments.map((comment: ISimpleComment, index: number) => (
						<Text style={style.commentContainer} numberOfLines={2} key={index}>
							<Text
								style={style.commentUserName}
								onPress={() => this.navigateToUserProfilePage(comment.owner.userId)}
								suppressHighlighting={true}
							>
								{comment.owner.username + '  '}
							</Text>
							<Text onPress={() => this.props.onCommentClick(false)}>{comment.text}</Text>
						</Text>
					))}
				</View>
			);
		}
	};

	private toggleShowFullText = () => {
		this.setState({
			fullTextVisible: true,
		});
	};

	private toggleDeclineReportModal = () => {
		this.setState({
			modalVisibleReportProblem: !this.state.modalVisibleReportProblem,
		});
	};

	private getTooltipItems = (): TooltipItem[] => [
		{
			label: 'Block',
			icon: Icons.redRoundCross,
			actionHandler: () => {
				ModalManager.safeRunAfterModalClosed(this.blockUserHandler);
			},
		},
		{
			label: 'Report a Problem',
			icon: Icons.iconReport,
			actionHandler: this.tooltipsReportPressedHandler,
		},
		...(this.props.canDelete
			? [
					{
						label: 'Delete Post',
						icon: Icons.iconDelete,
						actionHandler: this.tooltipsDeletePressedHandler,
					},
			  ]
			: []),
	];

	private tooltipsDeletePressedHandler = () => {
		if (this.props.onDeleteClick) {
			this.props.onDeleteClick(this.props.id);
			// console.log('Delete this post');
		}
	};

	private reportProblemHandler = (data: IReportData) => {
		this.toggleDeclineReportModal();
		// console.log('Report a problem', data);
	};

	private superLikeButtonPressedHandler = () => {
		alert('Super-Like this post');
	};

	private walletCoinsButtonPressedHandler = () => {
		alert('Go to my wallet');
	};

	private navigateToUserProfilePage = (userId: string) => {
		if (this.props.onUserClick) {
			this.props.onUserClick(userId);
		}
	};

	private handleHashTag = (hashtag: string) => {
		alert('Hashtags!! Coming soon..' + hashtag);
	};

	private handleUserTag = (tag: string) => {
		alert('Tags!!! Coming soon..' + tag);
	};

	private launchExternalURL = async (url: string) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (!supported) {
				alert('Cannot open link, link not supported');
			} else {
				return Linking.openURL(url);
			}
		} catch (ex) {
			console.log(ex);
		}
	};
}

export const WallPostCard = compose(
	withTranslations,
	blockUserHoc,
)(WallPostCardComp);
