import './TrainingSessions.css';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { TTrainingSessionList, ITrainingSession } from '../../types';
import { TrainingSessionForm } from '../TrainingSessionForm';
import { TrainingSession } from '../TrainingSession';

interface IProps {
  sessions?: TTrainingSessionList;
}

export const TrainingSessions = ( { sessions = [] } : IProps ) => {
  const [sessionList, setSessionList] = useState<TTrainingSessionList>(sessions);
  const [sessionToEdit, setSessionToEdit] = useState<ITrainingSession|undefined>(undefined);

  function mergeByDate(date: Date, distance: number): boolean {
    const dateString = date.toDateString();
    const session = sessionList.find((item) => item.date.toDateString() === dateString);
    if (!session) return false;
    session.distance += distance;
    return true;
  }

  function updateSession(id: string, date: Date, distance: number) : boolean {
    let sessions = sessionList;
    const session = sessions.find((item) => item.id === id);
    if (!session) return false;
    if (mergeByDate(date, distance)) {
      sessions = sessions.filter((item) => item.id !== id);
    } else {
      session.distance = distance;
      if (session.date.toString() !== date.toString()) {
        session.date = date;
        sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
      }
    }
    setSessionList([...sessions]);
    return true;
  }

  function addSession(date: Date, distance: number) : void {
    if (!mergeByDate(date, distance)) {
      sessionList.push({ id: uuid(), date, distance });
      sessionList.sort((a, b) => b.date.getTime() - a.date.getTime());
    }
    setSessionList([...sessionList]);
  }

  function handleFormSubmit({date, distance}: ITrainingSession) : void {
    if (sessionToEdit?.id) {
      updateSession(sessionToEdit.id, date, distance);
      setSessionToEdit(undefined);
    } else {
      addSession(date, distance);
    }
  }

  function handleSessionEditButtonClick(id: string) : void {
    setSessionToEdit(sessionList.find((session) => session.id === id))
  }

  function handleSessionRemoveButtonClick(id: string) : void {
    if (sessionToEdit && sessionToEdit.id === id) {
      setSessionToEdit(undefined);
    }
    setSessionList((list) => list.filter((item) => item.id !== id));
  }

  return (
    <div className="sessions">
      <TrainingSessionForm 
        date={`${sessionToEdit?.date?.toISOString().slice(0, 10) || ''}`}
        distance={`${sessionToEdit?.distance || ''}`}
        onSubmit={handleFormSubmit} 
      />
      <table className="sessions-list">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Пройдено, км.</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sessionList.map((session) => (
            <TrainingSession key={session.id} session={session}
              onEditButtonClick={handleSessionEditButtonClick}
              onRemoveButtonClick={handleSessionRemoveButtonClick}
              editing={session.id ? session.id === sessionToEdit?.id : false}
            />
          ))}
        </tbody>
      </table>
    </div>

  )
}
