import './TrainingSessionForm.css';
import { useState, useRef, useEffect } from 'react';
import { ITrainingSession } from '../../types';

interface IProps {
  date?: string;
  distance?: string;
  onSubmit?: (session: ITrainingSession) => void;
}

interface IFormState {
  date: string;
  distance: string;
}

export const TrainingSessionForm = ( { date = '', distance = '', onSubmit } : IProps ) => {
  const [formState, setFormState] = useState<IFormState>({date: '', distance: ''});
  const elDateInput = useRef<HTMLInputElement>(null);
  const elDistanceInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormState({ date, distance });
  }, [date, distance]);

  function reportValidity(element: HTMLInputElement | null, message: string) : undefined {
    if (!element) return;
    element.setCustomValidity(message);
    element.reportValidity();
  }

  function validate() : ITrainingSession | undefined {
    if (!formState.date.length) {
      return reportValidity(elDateInput.current, 'Дата не указана')
    }
    const date = new Date(formState.date);
    if (isNaN(date.getTime())) {
      return reportValidity(elDateInput.current, 'Ошибка формата указанной даты');
    }
    elDateInput.current?.setCustomValidity('');
    if (!/^\d+([,.]\d+)?$/.test(formState.distance)) {
      return reportValidity(elDistanceInput.current, 'Требуется указать число больше 0');
    }
    elDistanceInput.current?.setCustomValidity('');
    const distance: number = parseFloat(formState.distance.replace(',', '.'));
    return { date, distance };
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) : void {
    event.preventDefault();
    const session = validate();
    if (session) {
      if (onSubmit) onSubmit(session);
      setFormState({ date: '', distance: '' });
    }    
  }

  function handleInputDate(event: React.ChangeEvent<HTMLInputElement>) : void {
    setFormState((state) => ({...state, date: event.target.value}));
  }

  function handleInputDistance(event: React.ChangeEvent<HTMLInputElement>) : void {
    setFormState((state) => ({...state, distance: event.target.value}));
  }

  return (
    <form className='form-new-session' name='new-session' noValidate onSubmit={handleSubmit}>
      <div className='new-session-date_wrapper'>
        <label htmlFor='date'>Дата</label>
        <input ref={elDateInput} onChange={handleInputDate} required type='date' name='date' value={formState.date}/>
      </div>
      <div className='new-session-distance_wrapper'>
        <label htmlFor='distance'>Пройдено км</label>
        <input ref={elDistanceInput} onChange={handleInputDistance} required type='number' name='distance' value={formState.distance}/>
      </div>
      <button className='new-session-submit_button'>Ок</button>
    </form>
  )
}
