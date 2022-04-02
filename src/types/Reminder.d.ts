export {};

declare global {
  namespace Reminder {
    type Reminder = {
      id: number;
      description: string;
      datetime: string;
      city: string;
    };

    type City = {
      name: string;
      stateCode: string;
      country: string;
      lat: number;
      lon: number;
    };
  }
}
