import UserProfileType from "~/components/UserProfileType/UserProfileType";

export default function Index() {
  return (
    <div className="progress">
      <div className="progress_inner">
        <div className="progress_inner__step">
          <label htmlFor="step-1">Start order</label>
        </div>
        <div className="progress_inner__step">
          <label htmlFor="step-2">Prepare gift</label>
        </div>
        <div className="progress_inner__step">
          <label htmlFor="step-3">Pack gift</label>
        </div>
        <div className="progress_inner__step">
          <label htmlFor="step-4">Decorate box</label>
        </div>
        <div className="progress_inner__step">
          <label htmlFor="step-5">Send gift</label>
        </div>
        <input checked onChange={() => {}} id="step-1" name="step" type="radio" />
        <input id="step-2" name="step" type="radio" />
        <input id="step-3" name="step" type="radio" />
        <input id="step-4" name="step" type="radio" />
        <input id="step-5" name="step" type="radio" />
        <div className="progress_inner__bar"></div>
        <div className="progress_inner__bar--set"></div>
        <div className="progress_inner__tabs">
          <div className="tab tab-0">
            <h1>Travel profile type</h1>
            <UserProfileType />
          </div>
          <div className="tab tab-1">
            <h1>Prepare gift</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tortor ipsum, eleifend vitae massa non, dignissim finibus eros. Maecenas non eros tristique nisl maximus sollicitudin.</p>
          </div>
          <div className="tab tab-2">
            <h1>Pack gift</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tortor ipsum, eleifend vitae massa non, dignissim finibus eros. Maecenas non eros tristique nisl maximus sollicitudin.</p>
          </div>
          <div className="tab tab-3">
            <h1>Decorate box</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tortor ipsum, eleifend vitae massa non, dignissim finibus eros. Maecenas non eros tristique nisl maximus sollicitudin.</p>
          </div>
          <div className="tab tab-4">
            <h1>Send gift</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tortor ipsum, eleifend vitae massa non, dignissim finibus eros. Maecenas non eros tristique nisl maximus sollicitudin.</p>
          </div>
        </div>
        <div className="progress_inner__status">
          <div className="box_base"></div>
          <div className="box_lid"></div>
          <div className="box_ribbon"></div>
          <div className="box_bow">
            <div className="box_bow__left"></div>
            <div className="box_bow__right"></div>
          </div>
          <div className="box_item"></div>
          <div className="box_tag"></div>
          <div className="box_string"></div>
        </div>
      </div>
    </div>
  );
}
