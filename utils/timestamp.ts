// Mock Timestamp implementation
// This is a simplified mock. Firebase Timestamps have toDate(), toMillis(), etc.
// If you need those, expand this mock.

export class Timestamp {
  readonly seconds: number;
  readonly nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  static now(): Timestamp {
    const now = Date.now();
    const seconds = Math.floor(now / 1000);
    const nanoseconds = (now % 1000) * 1e6;
    return new Timestamp(seconds, nanoseconds);
  }

  static fromDate(date: Date): Timestamp {
    const seconds = Math.floor(date.getTime() / 1000);
    const nanoseconds = (date.getTime() % 1000) * 1e6;
    return new Timestamp(seconds, nanoseconds);
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1e6);
  }

  toMillis(): number {
    return this.seconds * 1000 + this.nanoseconds / 1e6;
  }

  isEqual(other: Timestamp): boolean {
    return this.seconds === other.seconds && this.nanoseconds === other.nanoseconds;
  }

  valueOf() {
    return this.toMillis();
  }
}

// Helper for types that might expect FirebaseFirestoreTypes.Timestamp
// This allows our mock Timestamp to be somewhat compatible.
// In a real scenario, you'd either ensure all Timestamp usages
// are through your own abstraction or make this mock more comprehensive.
export type MockFirestoreTimestamp = Timestamp;
// export type FirebaseFirestoreTypes = { // Minimal mock for what might be used
//   Timestamp: typeof Timestamp;
//   FieldValue: {
//     serverTimestamp: () => Timestamp; // Or a special marker object if needed
//   };
//   // Add other Firestore types if they appear in your type definitions
// };

// // Mock FieldValue if used, e.g., for serverTimestamp()
// export const FieldValue = {
//   serverTimestamp: () => Timestamp.now() // For mock, serverTimestamp is just client's now
//   // delete: () => { /* mock delete field sentinel */ },
//   // arrayUnion: (...args: any[]) => { /* mock arrayUnion sentinel */ },
//   // arrayRemove: (...args: any[]) => { /* mock arrayRemove sentinel */ },
//   // increment: (n: number) => { /* mock increment sentinel */ },
// };

// This utility helps bridge the gap where actual Firebase types might be expected,
// particularly `Timestamp` and `FieldValue.serverTimestamp()`.
// Adjust your `types/index.ts` if it directly imports from `@react-native-firebase/firestore`
// for these types, to instead use these mocks or an abstraction.
// For example, your `Car` type might have `postedAt: FirebaseFirestoreTypes.Timestamp;`
// You would change it to `postedAt: Timestamp;` and use this mock.
// The `valueOf` method is added to allow direct comparison of Timestamp objects (e.g. in sorting).
