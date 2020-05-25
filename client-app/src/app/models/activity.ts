export interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  date: Date;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  attendees: IAttendee[];
}

// Extend the IActivity interface and add a time property
export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date;
}

// Define a class with a initializer constructor
export class ActivityFormValues implements IActivityFormValues {
  id?: string = undefined;
  title: string = "";
  category: string = "";
  description: string = "";
  date?: Date = undefined;
  time?: Date = undefined;
  city: string = "";
  venue: string = "";

  constructor(init?: IActivityFormValues) {
    // Check that received activity obj is not null and that it has a date
    if (init && init.date) init.time = init.date;

    // Assign the new object with the received fields
    Object.assign(this, init);
  }
}

export interface IAttendee {
  username: string;
  displayName: string;
  image: string;
  isHost: boolean;
}
