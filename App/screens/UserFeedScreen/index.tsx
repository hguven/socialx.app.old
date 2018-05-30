import get from 'lodash/get';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {IWallPostCardProp} from 'components/Displayers';
import {NavigationScreenProp} from 'react-navigation';
import {Images} from 'theme';
import {NewWallPostData} from '../NewWallPostScreen';
import UserFeedScreenComponent from './screen';

import {
	addMediaHoc,
	createPostHoc,
	deleteOwnPostHoc,
	getUserPostsHoc,
	likePostHoc,
	removeLikePostHoc,
	userHoc,
} from 'backend/graphql';
import {graphql} from 'react-apollo';
import {
	IAllPostsDataResponse,
	IComments,
	ICommentsResponse,
	IPaginatedPosts,
	IPostsProps,
	IUserDataResponse,
	IUserQuery,
} from 'types';
import {CurrentUser} from 'utilities';

import {hideActivityIndicator, showActivityIndicator} from 'backend/actions';

// import {IBlobData} from '../../lib/ipfs';
import {IBlobData} from 'ipfslib';
import {addBlobFiles} from 'utilities/ipfs';

import {ipfsConfig as base} from 'configuration';

import {IWalletActivityScreenComponentProps} from '../WalletActivityScreen/screen';
import {IMediaRec} from './types';

export interface IFeedProps {
	navigation: NavigationScreenProp<any>;
	hideShareSection: boolean;
	searchTerm: string;
}

interface IUserFeedScreenProps extends IFeedProps {
	data: IUserDataResponse;
	User: IUserDataResponse;
	// TODO: create interface
	createPost: any;
	likePost: any;
	removeLikePost: any;
	addMedia: any;
	startMediaPost: any;
	startPostadd: any;
	deletingPostLoad: any;
	stopLoading: any;
	deletePost: any;
	loading: boolean;
	Items: any;
	refresh: () => void;
	nextToken: string | null;
	noPosts: boolean;
	loadMore: () => any;
	hasMore: boolean;
}

interface IUserFeedScreenState {
	refreshing: boolean;
	loadingMore: boolean;
}

class UserFeedScreen extends Component<IUserFeedScreenProps, IUserFeedScreenState> {
	public state = {
		refreshing: false,
		loadingMore: false,
	};

	public render() {
		const {data, loading, noPosts, refresh, loadMore, Items, hasMore} = this.props;

		console.log('TODO: Filter Items for search term', this.props.searchTerm);

		return (
			<UserFeedScreenComponent
				noPosts={noPosts}
				isLoading={loading || data.loading}
				loadingMore={this.state.loadingMore}
				hasMore={hasMore}
				currentUser={data.user}
				refreshing={this.state.refreshing}
				refreshData={this.refreshWallPosts}
				avatarImage={this.getAvatarImage()}
				wallPosts={Items}
				loadMorePosts={this.onLoadMore}
				addWallPost={this.addWallPostHandler}
				showNewWallPostPage={this.showNewWallPostPage}
				hideShareSection={this.props.hideShareSection}
				onLikePress={this.onLikeButtonClickHandler}
				onPostDeletePress={this.onPostDeleteClickHandler}
				onUserPress={this.gotoUserProfile}
				onMediaPress={this.onMediaObjectPressHandler}
				onCommentPress={this.onCommentsButtonClickHandler}
			/>
		);
	}

	private onLoadMore = async () => {
		if (!this.state.loadingMore) {
			const {loadMore} = this.props;
			try {
				this.setState({
					loadingMore: true,
				});
				const loadResult: any = await loadMore();
				this.setState({
					loadingMore: false,
				});
			} catch (ex) {
				console.log(ex);
				this.setState({
					loadingMore: false,
				});
			}
		}
	}

	private getAvatarImage = () => {
		let ret = Images.user_avatar_placeholder;
		const {data} = this.props;
		if (!data.loading && data.user.avatar) {
			ret = {uri: base.ipfs_URL + data.user.avatar.hash};
		}
		return ret;
	}

	private showNewWallPostPage = () => {
		const avatarUri = this.props.data.user.avatar
			? {uri: base.ipfs_URL + this.props.data.user.avatar.hash}
			: Images.user_avatar_placeholder;
		this.props.navigation.navigate('NewWallPostScreen', {
			fullName: this.props.data.user.name,
			avatarImage: avatarUri,
			postCreate: this.addWallPostHandler,
		});
	}

	private create = async (Media: string[], text?: string) => {
		const {createPost} = this.props;
		if (Media.length > 0) {
			if (text) {
				await createPost({
					variables: {
						text,
						Media,
					},
				});
			} else {
				await createPost({
					variables: {
						Media,
					},
				});
			}
		} else {
			await createPost({
				variables: {
					text,
				},
			});
		}
	}

	private addWallPostHandler = async (data: NewWallPostData) => {
		const {addMedia, startMediaPost, startPostadd, stopLoading} = this.props;

		const ipfsHashes: any = [];
		const mediaIds: string[] = [];

		// start creating post loading
		startPostadd();

		// todo @serkan @jake let's discuss parallel/series async execution
		// for await of vs await Promise.all
		try {
			for (let i = 0; i < data.mediaObjects.length; i++) {
				const currentData = data.mediaObjects[i];
				const gqlResp = await addMedia({
					variables: {
						hash: currentData.content.Hash,
						type: currentData.content.Name.split('.')[1],
						optimizedHash: currentData.contentOptimized ? currentData.contentOptimized.Hash : currentData.content.Hash,
						size: parseInt(currentData.content.Size, undefined),
					},
				});
				mediaIds.push(gqlResp.data.addMedia.id);
			}
			await this.create(mediaIds, data.text);
			// refresh the wall posts to append the new post
			this.refreshWallPosts();
		} catch (ex) {
			//
			console.log('ex from create', ex);
		}

		stopLoading();
	}

	private refreshWallPosts = async () => {
		this.setState({refreshing: true});
		try {
			await this.props.data.refetch();
			await this.props.refresh();
			this.setState({
				refreshing: false,
			});
		} catch (Ex) {
			this.setState({refreshing: false});
			console.log('ex', Ex);
		}
	}

	private onLikeButtonClickHandler = async (likedByMe: boolean, postId: string) => {
		const {likePost, removeLikePost, Items, refresh} = this.props;

		const likeQuery = {variables: {postId}};

		const result = likedByMe ? await removeLikePost(likeQuery) : await likePost(likeQuery);
		console.log('result:', result);

		if (result.error) {
			console.log(result.error);
			return;
		}

		// await refresh();
	}

	private onPostDeleteClickHandler = async (postId: string) => {
		const {deletingPostLoad, deletePost, stopLoading} = this.props;

		deletingPostLoad();
		try {
			const mVar = {variables: {postId}};
			await deletePost(mVar);
			await this.refreshWallPosts();
		} catch (ex) {
			// user doesnt own the post, thus cant delete, or server issues
		}
		stopLoading();
	}

	private gotoUserProfile = (userId: string) => {
		this.props.navigation.navigate('UserProfileScreen', {userId});
	}

	private onMediaObjectPressHandler = (index: number, media: any) => {
		this.props.navigation.navigate('MediaViewerScreen', {
			mediaObjects: media,
			startIndex: index,
		});
	}

	private onCommentsButtonClickHandler = (postId: any, userId: any) => {
		this.props.navigation.navigate('CommentsStack', {postId, userId});
	}
}

const MapDispatchToProps = (dispatch: any) => ({
	startMediaPost: () => dispatch(showActivityIndicator('Decentralizing your media', 'Please wait..')),
	deletingPostLoad: () => dispatch(showActivityIndicator('Removing your post..')),
	startPostadd: () => dispatch(showActivityIndicator('Creating your post', 'finalizing post..')),
	stopLoading: () => dispatch(hideActivityIndicator()),
});

const reduxWrapper = connect(null, MapDispatchToProps)(UserFeedScreen);

const userWrapper = userHoc(reduxWrapper);
const createPostWrapper = createPostHoc(userWrapper);
const addMediaWrapper = addMediaHoc(createPostWrapper);
const likePostWrapper = likePostHoc(addMediaWrapper);
const removeLikePostWrapper = removeLikePostHoc(likePostWrapper);
const deletePostWrapper = deleteOwnPostHoc(removeLikePostWrapper);

export default deletePostWrapper;
