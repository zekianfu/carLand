// backend/utils/timestamp.ts

export class Timestamp {
  seconds: number;
  nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
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
