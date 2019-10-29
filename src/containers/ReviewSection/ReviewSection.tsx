import React from 'react';
import { connect } from 'react-redux';
import { userSelector } from '../../redux/selectors';
import YourReview from '../../containers/YourReview/YourReview';
import SignUp from '../../components/SignUp/SignUp';
import styles from './ReviewSection.module.scss';
import CommentList from '../CommentList/CommentList';
import ReviewListPage from '../ReviewListPage/ReviewListPage';
import Paging from '../Paging/Paging';

interface ReviewSectionProps {
  target_gid: string;
  type: 'recording' | 'release_group';
  user?: string;
}

function ReviewSection(props: ReviewSectionProps) {
  const { target_gid, type, user } = props;

  return (
    <div className={styles.reviewSection}>
      <div>
        <div className="heading-1">Your Review</div>
        {user ? (
          <YourReview target_gid={target_gid} type={type} />
        ) : (
          <div className="card">
            To write reviews please <SignUp />.
          </div>
        )}
      </div>

      <div>
        <div className="heading-1">Recent Reviews</div>
        <Paging
          component={ReviewListPage}
          props={{ includeThumbnail: false }}
          params={{ target_gid, pageSize: 3, exclude: user }}
          gridGap="4"
        />
      </div>

      <div>
        <div className="heading-1">Comments</div>
        <div className="card">
          <CommentList target_gid={target_gid} type={type} />
        </div>
      </div>
    </div>
  );
}

export default connect(userSelector)(ReviewSection);
