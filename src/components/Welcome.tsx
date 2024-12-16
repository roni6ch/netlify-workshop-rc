import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Form from './Form';

gsap.registerPlugin(ScrollTrigger);

export default function Welcome() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showGoUp, setShowGoUp] = useState(false);
  const [doneAnimation, setDoneAnimation] = useState(false);

  const { contextSafe } = useGSAP({ scope: containerRef });

  const clickHandler = contextSafe(() => {
    gsap.timeline({
      smoothChildTiming: true,
      defaults: {
        duration: 3,
        ease: 'power3.out',
      },
    })
      .fromTo('.sky', { y: 0 }, { y: -200 }, 0)
      .fromTo('.cloud1', { y: 100 }, { y: -800 }, 0)
      .fromTo('.cloud2', { y: -150 }, { y: -500 }, 0)
      .fromTo('.cloud3', { y: -50 }, { y: -650 }, 0)
      .fromTo('.mountBg', { y: -10 }, { y: -100 }, 0)
      .fromTo('.mountMg', { y: -30 }, { y: -250 }, 0)
      .fromTo('.mountFg', { y: -50 }, { y: -600 }, 0)
    setShowGoUp(true);
    setTimeout(() => {
      setDoneAnimation(true);
    }, 1200);
  });
  const mouseEnterHandler = contextSafe(() => {
    gsap.to('.arrow', { y: 10, duration: 0.8, ease: 'back.inOut(3)', overwrite: 'auto' })
  });

  const mouseLeaveHandler = contextSafe(() => {
    gsap.to('.arrow', { y: 0, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  });

  const handleGoUp = () => {
    setShowGoUp(false);
    setDoneAnimation(false);
    gsap.timeline({
      smoothChildTiming: true,
      defaults: {
        duration: 3,
        ease: 'power3.out',
      },
    }).fromTo('.sky', { y: 0 }, { y: 0 })
      .fromTo('.cloud1', { y: -800 }, { y: 100 }, 0)
      .fromTo('.cloud2', { y: -500 }, { y: -150 }, 0)
      .fromTo('.cloud3', { y: -650 }, { y: -50 }, 0)
      .fromTo('.mountBg', { y: -100 }, { y: -10 }, 0)
      .fromTo('.mountMg', { y: -250 }, { y: -30 }, 0)
      .fromTo('.mountFg', { y: -600 }, { y: -50 }, 0);

  };
  // https://codepen.io/shunyadezain/details/poyEBLE
  return (
    <div ref={containerRef} onMouseEnter={() => mouseEnterHandler()} onMouseLeave={() => mouseLeaveHandler()}>
      <div className="scrollDist"></div>
      <main className='tracking-in-expand' >
        <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
         { <>
            <mask id="m">
              <g className="cloud1">
                <rect fill="#fff" width="100%" height="801" y="799" />
                <image
                  href="https://assets.codepen.io/721952/cloud1Mask.jpg"
                  width="1200"
                  height="800"
                />
              </g>
            </mask>

            <image
              className="sky"
              href="https://assets.codepen.io/721952/sky.jpg"
              width="1200"
              height="590"
            />
            <image
              className="mountBg"
              href="https://assets.codepen.io/721952/mountBg.png"
              width="1200"
              height="800"
            />
            <image
              className="mountMg"
              href="https://assets.codepen.io/721952/mountMg.png"
              width="1200"
              height="800"
            />
            <image
              className="cloud2"
              href="https://assets.codepen.io/721952/cloud2.png"
              width="1200"
              height="800"
            />
            <image
              className="mountFg"
              href="https://assets.codepen.io/721952/mountFg.png"
              width="1200"
              height="800"
            />
            <image
              className="cloud1"
              href="https://assets.codepen.io/721952/cloud1.png"
              width="1200"
              height="800"
            />
            <image
              className="cloud3"
              href="https://assets.codepen.io/721952/cloud3.png"
              width="1200"
              height="800"
            />
            <text fill="#fff" x="350" y="200">
              EXPLORE
            </text>
            <polyline
              className="arrow"
              fill="#fff"
              points="599,250 599,289 590,279 590,282 600,292 610,282 610,279 601,289 601,250"
            />
          </> }

          <g mask="url(#m)">
            {!doneAnimation && <rect fill="#fff" width="100%" height="100%"></rect>}
            {doneAnimation && <><image
              className="background-image tracking-in-expand"
              href="https://res.cloudinary.com/tripactions/image/upload/f_auto,q_22/v1734334720/site/growth/test/home-process-bg-6.b96cda387f100369b0bb_2.jpg"
              width="1200"
              height="800"
            />
              <defs>
                <linearGradient id="combinedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect
                id="overlayRect"
                x="0"
                y="0"
                width="1200"
                height="800"
                className="fade-container"
                opacity="1"
                fill="url(#combinedGradient)"
              />
            </>
            }
            <image
              x="415"
              y="100"
              href="https://d2w7f1pl8j4yzn.cloudfront.net/logos/navan/navan-dynamic.svg"
              width="370"
              height="100"
              style={{ filter: doneAnimation ? '' : 'invert(1)' }}
            />
          </g>

          <rect
            onClick={() => clickHandler()}
            id="arrow-btn"
            width="100"
            height="100"
            opacity="0"
            x="550"
            y="220"
            style={{ cursor: 'pointer' }}
          />
        </svg>
        {doneAnimation && <div className="form-container tracking-in-expand" style={{
          position: "absolute",
          left: 0,
          right: 0,
          fontSize: "20px",
          top: "25%"
        }}>
          <Form />


        </div>}
      </main>
      {
        showGoUp && <button
          onClick={() => handleGoUp()}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Go Up
        </button>
      }
    </div >
  );
}