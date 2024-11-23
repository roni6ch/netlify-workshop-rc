import { useSearchParams } from "next/navigation";
import { SetStateAction, useState } from "react";
import UserProfileType from "~/components/UserProfileType/UserProfileType";
import CompanyDetailsForm from "~/components/CompanyDetailsForm/CompanyDetailsForm";

export default function Index() {
  const [selectedStep, setSelectedStep] = useState('step-1');
  const searchParams = useSearchParams();

  const bird = searchParams.get('bird');

  const handleRadioChange = (event: { target: { id: SetStateAction<string>; }; }) => {
    setSelectedStep(event.target.id);
  };
  return (
    <div className="progress">
      <div className="progress_inner">
        <div className="progress_inner__step">
          <label htmlFor="step-1">Company type</label>
        </div>
        <div className="progress_inner__step">
          <label htmlFor="step-2">Company details</label>
        </div>
        <div className="progress_inner__step">
          <label htmlFor="step-3">Pricing estimations</label>
        </div>
        {['step-1', 'step-2', 'step-3'].map((stepId) => (
          <input
            key={stepId}
            id={stepId}
            name="step"
            type="radio"
            checked={selectedStep === stepId}
            onChange={handleRadioChange}
          />
        ))}

        <div className="progress_inner__bar"></div>
        <div className="progress_inner__bar--set"></div>
        <div className="progress_inner__tabs">
          <div className="tab tab-0">
            {/* <h1 className="font">Profile Type</h1> */}
            <UserProfileType onData={data => setSelectedStep(data)}  />
          </div>
          <div className="tab tab-1">
            <CompanyDetailsForm onData={data => setSelectedStep(data)} />
          </div>
          <div className="tab tab-2">
            <p>bla!</p>
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
      {bird && <div className="bird-container-wrapper" >
        <div className="bird-container bird-container--one">
          <div className="bird bird--one"></div>
        </div>

        <div className="bird-container bird-container--two">
          <div className="bird bird--two"></div>
        </div>

        <div className="bird-container bird-container--three">
          <div className="bird bird--three"></div>
        </div>

        <div className="bird-container bird-container--four">
          <div className="bird bird--four"></div>
        </div>
      </div>}


    </div>
  );
}
