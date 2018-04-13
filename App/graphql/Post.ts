import gql from 'graphql-tag';
import {graphql, QueryProps} from 'react-apollo';

const likePost = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
        }
    }
`;

export const likePostHoc = (comp: any) => graphql(likePost, { name: 'likePost' })(comp);