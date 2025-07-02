// Mock Timestamp implementation
// This is a simplified mock. Firebase Timestamps have toDate(), toMillis(), etc.
// If you need those, expand this mock.

export class Timestamp {
  private date: Date;
  constructor(date: Date) {
    this.date = date;
  }
  static now() {
    return new Timestamp(new Date());
  }
  static fromDate(date: Date) {
    return new Timestamp(date);
  }
  toDate() {
    return this.date;
  }
  getTime() {
    return this.date.getTime();
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
