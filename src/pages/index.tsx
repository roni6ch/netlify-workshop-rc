import { useEffect } from "react";
import Rellax from "rellax";
// https://dixonandmoe.com/rellax/#GettingStarted Rellax
export default function Index() {
  useEffect(() => {
    new Rellax('.rellax');
  }, []);
  return <>
    <section className="section section-top">
      <div className="content rellax" data-rellax-speed="5">
        <h1>Create your company account</h1>
        <a href="#" className="btn btn-primary">Learn More</a>
      </div>
    </section>

    <section className="section section-stream">
      <img
        className="play rellax"
        src="https://d2w7f1pl8j4yzn.cloudfront.net/rewards/rewards-education-bonvoy-pts.webp"
        alt=""
        data-rellax-speed="-1" data-rellax-xs-speed="-5"
      />
      <div className="content rellax" data-rellax-speed="10">
        <div>
          <h2 className="secondary-text">Exclusive travel discounts
          </h2>
          <p>
          Book at competitive rates, earn third-party loyalty points and discounts
          </p>
        </div>
        <div>
          <h2 className="secondary-text">Best-in-class support
          </h2>
          <p>
          Skip long support lines and get free, personalized travel support 24/7
          </p>
        </div>
      </div>
    </section>

    <section className="section section-grid">
      <div className="rellax" data-rellax-speed="1" data-rellax-xs-speed="3">
        <i className="fas fa-video fa-3x secondary-text"></i>
        <h2>Navan app
        <span className="secondary-text dot">.</span></h2>
        <p>
        Download the Navan app to manage your bookings and get real-time travel updates on the go.
        </p>
      </div>
      <div className="rellax" data-rellax-speed="4" data-rellax-xs-speed="3">
        <i className="fas fa-users fa-3x secondary-text"></i>
        <h2>Travel is free!</h2>
        <p>
        Say goodbye to surprise charges and unexpected costs
        </p>
      </div>
      <div className="rellax" data-rellax-speed="7" data-rellax-xs-speed="3">
        <i className="fas fa-book fa-3x secondary-text"></i>
        <h2>
        Expense is free</h2>
        <p>
        for the first 3 active users
        Then it’s only $10 a month per additional active user.
        </p>
      </div>
    </section>

    <footer className="footer">
      <ul>
        <li><a href="#">Faq</a></li>
        <li><a href="#">Terms of Use</a></li>
        <li><a href="#">Privacy Notice</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">About Us</a></li>
      </ul>
    </footer>
  </>;
}
