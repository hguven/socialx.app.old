import gql from 'graphql-tag';
import {graphql, QueryProps} from 'react-apollo';

import {CurrentUserInfo} from 'utilities';

const options: any = {
	fetchPolicy: 'no-cache',
};

export const createUser = gql`
	mutation create(
		$username: String!
		$name: String!
		$email: String!
		$bio: String
		$age: Int
		$gender: String
		$location: String
		$avatar: ID
	) {
		createUser(
			username: $username
			name: $name
			email: $email
			bio: $bio
			age: $age
			gender: $gender
			location: $location
			avatar: $avatar
		) {
			userId
		}
	}
`;

// TODO: deref all nested objs
export const user = gql`
	query user {
		user {
			userId
			username
			name
			email
			bio
			age
			gender
			location
			avatar {
				hash
				size
				type
			}
			posts {
				id
				text
				owner {
					username
					avatar {
						id
						hash
					}
				}
				likes {
					userId
				}
				comments {
					id
				}
				createdAt
				Media {
					id
					type
					hash
					size
					optimizedHash
				}
			}
		}
	}
`;

export const createUpdateUserHoc = (comp: any) => graphql(createUser, {name: 'createUser', options})(comp);

export const userHoc = (comp: any) => graphql(user, {options: {fetchPolicy: 'network-only'}})(comp);
