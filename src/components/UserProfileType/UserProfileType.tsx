import styles from './UserProfileType.module.scss';

interface UserProfileTypeProps {
  onData: (type: string) => void;
}

export default function UserProfileType({ onData }: UserProfileTypeProps) {
  const handleCardClick = (type: string) => {
    console.log(type);
    onData('step-2');
  };
  return (
    <div className={styles['container-wrapper']}>
      <div className={styles['container-fluid']}>
        <div className={styles['container']}>
          <div className={`${styles['flex-container']}`}>
            <div className={`${styles['col-sm-4']}`} onClick={() => handleCardClick('T')}>
              <div className={`${styles['card']}`}>
                <div className={styles['title']}>
                  <i className="fa fa-paper-plane" aria-hidden="true"></i>
                  <h2>Travel</h2>
                </div>
                <div className={styles['price']}>
                  <h4><sup>$</sup>0</h4>
                </div>
                <div className={styles['option']}>
                  <ul>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> 15 Free trips </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Email reminders </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Full LOB`s </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Live Support </li>
                  </ul>
                </div>
                <a href="#">Join now</a>
              </div>
            </div>
            <div className={styles['col-sm-4']}  onClick={() => handleCardClick('TE')}>
              <div className={`${styles['card']} ${styles['text-center']}`}>
                <div className={styles['title']}>
                  <i className="fa fa-plane" aria-hidden="true"></i>
                  <h2>Travel and Expense</h2>
                </div>
                <div className={styles['price']}>
                  <h4><sup>$</sup>50</h4>
                </div>
                <div className={styles['option']}>
                  <ul>
                  <li> <i className="fa fa-check" aria-hidden="true"></i> 30 Free trips </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Navan expense card </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Admin Dashboard </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Live Support </li>
                  </ul>
                </div>
                <a href="#">I`m in!</a>
              </div>
            </div>
            <div className={styles['col-sm-4']}  onClick={() => handleCardClick('BFO')}>
              <div className={`${styles['card']} ${styles['text-center']}`}>
                <div className={styles['title']}>
                  <i className="fa fa-rocket" aria-hidden="true"></i>
                  <h2>Book for Employees</h2>
                </div>
                <div className={styles['price']}>
                  <h4><sup>$</sup>100</h4>
                </div>
                <div className={styles['option']}>
                  <ul>
                  <li> <i className="fa fa-check" aria-hidden="true"></i> Lots of benefits </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Travel Planner summary </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Admin Dashboard </li>
                    <li> <i className="fa fa-check" aria-hidden="true"></i> Live Support </li>
                  </ul>
                </div>
                <a href="#">Sign me up</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
