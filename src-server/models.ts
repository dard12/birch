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

export interface NoteDoc {
  id: string;
  header?: string;
  content?: string;
  author_id: string;
}

export interface ReminderDoc {
  id: string;
  header?: string;
  author_id: string;
}

export interface ReminderItemDoc {
  id: string;
  content?: string;
}

export interface PersonDoc {
  id: string;
  header?: string;
  content?: string;
  last_meeting: Date;
}

export interface EventDoc {
  id: string;
  parsed_start: Date;
  start?: Start;
  summary?: string;
  activity?: string;
  people: string[];
  gcal_id?: string;
}

export interface Start {
  date?: string;
  dateTime?: Date;
  timeZone?: string;
}
