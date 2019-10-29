export interface RecordingDoc {
  id: number;
  gid: string;
  name: string;
  artist_name?: string;
  artist_credit_name?: string;
  release_group_name?: string;
  release_gid?: string;
  release_group_id?: number;
  release_date_year?: number;
  cover_id?: string;
  rating?: number;
  artist_id?: number;
  musicbrainz_rating?: number;
  language_name?: string;
  tag_ids?: number[];
}

export interface ReleaseGroupDoc {
  id: number;
  gid: string;
  name: string;
  artist_name: string;
  artist_credit_name: string;
  release_gid: string;
  release_date_year?: number;
  cover_id?: string;
  rating?: number;
  artist_id?: string;
  recording_ids: number[];
  musicbrainz_rating?: number;
  language_name?: string;
  tag_ids?: number[];
}

export interface ReviewDoc {
  id: string;
  author_id: string;
  target_gid: string;
  content: any;
  rating: number;
  type: 'recording' | 'release_group';
}

export interface TagDoc {
  id: number;
  name: string;
}

export interface UserDoc {
  id: string;
  username: string;
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  facebook_id?: string;
  google_id?: string;
  photo?: string;
  bot?: boolean;
  onboarding_welcome?: boolean;
}

export interface VoteDoc {
  author_id: string;
  review_id: string;
  vote: number;
}
