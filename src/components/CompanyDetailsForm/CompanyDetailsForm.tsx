import styles from './CompanyDetailsForm.module.scss';
import Planes from "~/components/Planes/Planes";

interface CompanyDetailsFormProps {
  onData: (type: string) => void;
}

export default function CompanyDetailsForm({ onData }: CompanyDetailsFormProps) {

  const handleFormSubmit = () => {
    onData('step-3');
  };

  return (<div className={styles['container']}>
    <div className={styles['form-left']}>
      <div>
        <i className="fas fa-check"></i>
        <h4>Quick and free sign-up</h4>
      </div>
      <h5>Enter your email address to create an account</h5>
      <div>
        <i className="fas fa-check"></i>
        <h4>Cross-platform solution</h4>
      </div>
      <h5>Preview your itinerary trip on web and app online and offline while on trip</h5>
      <div>
        <i className="fas fa-check"></i>
        <h4>Set policies and see analytics</h4>
      </div>
      <h5>Use our Admin dashboard to see live expenses and set users trip policies</h5>

      <div className={styles['planes']}>
        <Planes />
      </div>
      <div id="canvas-container-planes" >
        <canvas id="sineCanvas" width="1024" height="300"></canvas>
      </div>

    </div>
    <div className={styles['form-right']}>
      <form id="form" className={styles['form']}>
        <div className={styles['form-control']}>
          <label htmlFor="name">First name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your first name"
            autoComplete="off"
            autoFocus
          />
          <small>Error message</small>
        </div>
        <div className={styles['form-control']}>
          <label htmlFor="name">Last name</label>
          <input
            type="text"
            id="last name"
            placeholder="Enter your last name"
            autoComplete="off"
            autoFocus
          />
          <small>Error message</small>
        </div>
        <div className={styles['form-control']}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            placeholder="Enter your email address"
            autoComplete="off"
            autoFocus
          />
          <small>Error message</small>
        </div>
        <div className={styles['form-control']}>
          <label htmlFor="company">Company name</label>
          <input
            type="text"
            id="company"
            placeholder="Enter your company name"
            autoComplete="off"
          />
          <small>Error message</small>
        </div>
        <div className={styles['form-control']}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Type to create a password"
          />
          <small>Error message</small>
        </div>
        <div className={styles['form-control']}>
          <label htmlFor="password">Re Password</label>
          <input
            type="password"
            id="password"
            placeholder="Type to create a password"
          />
          <small>Error message</small>
        </div>
        <div className={styles['checkbox-control']}>
          <input type="checkbox" id="checkbox" />
          <label htmlFor="checkbox">
            Get updates and notifications about our product
          </label>
        </div>
        <button className={styles['btn']} id="btn" onClick={() => handleFormSubmit()}>
          Submit
        </button>
      </form>
    </div>
  </div>
  );
}
