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
