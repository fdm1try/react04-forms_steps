interface ITrainingSession {
  id?: string;
  date: Date;
  distance: number;
}

type TTrainingSessionList = Array<ITrainingSession>;

export type { ITrainingSession, TTrainingSessionList }