'use client';
import styles from '@/app/form.module.css';
import {useFormState as useFormState} from 'react-dom';
import {createUser} from '@/app/actions';
const initialState = {
  message: null
};

export default function AddUserForm() {
  const [state, formAction] = useFormState(createUser, initialState);

  return (
    <form action={formAction} className={styles.myform}>
      {state && state.message && (
        <ul
          aria-live='polite'
          className={`sr-only, ${styles.myUl}`}
          role='status'
        >
          {state.message.map((msg, index) => {
            return (
              <li className='error' key={index}>
                {msg}
              </li>
            );
          })}
        </ul>
      )}
      <div className='form-group'>
        <label className={styles.myLabel}>
          First Name:
          <input className={styles.myInput} name='firstName' type='text' />
        </label>
        <br />
      </div>
      <div className='form-group'>
        <label className={styles.myLabel}>
          Last Name:
          <input className={styles.myInput} name='lastName' type='text' />
        </label>
      </div>
      <div className='form-group'>
        <button className={styles.myButton} type='submit'>
          Add User
        </button>
      </div>
    </form>
  );
}
