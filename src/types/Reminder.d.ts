export {};

declare global {
  namespace Reminder {
    type Reminder = {
      id: number;
      description: string;
      datetime: string;
      city: string;
    };
  }
}
