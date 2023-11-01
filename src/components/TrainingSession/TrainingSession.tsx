import './TrainingSession.css';
import { ITrainingSession } from '../../types';

interface IProps {
  session: ITrainingSession;
  onEditButtonClick?: (id: string) => void;
  onRemoveButtonClick?: (id: string) => void;
  editing?: boolean;
}

export const TrainingSession = ( { session, onEditButtonClick, onRemoveButtonClick, editing = false } : IProps ) => {

  function handleEditClick() {
    if (onEditButtonClick && session.id) onEditButtonClick(session.id);
  }
  function handleRemoveClick() {
    if (onRemoveButtonClick && session.id) onRemoveButtonClick(session.id);
  }

  return (
    <tr className={`session ${editing ? 'session-state-edit' : ''}`}>
      <td className="session-date">{session.date.toLocaleDateString()}</td>
      <td className="session-distance">{session.distance}</td>
      <td className="session-controls-edit">
        <button onClick={handleEditClick} disabled={editing} className="button">✎</button>
      </td>
      <td className="session-controls-remove">
        <button onClick={handleRemoveClick} className="button session-remove">✘</button>
      </td>
    </tr>
  )
}
