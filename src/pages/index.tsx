import { useState } from "react";
import Header from "~/components/Header";
import MainContainer from "~/components/MainContainer";
import PopUpModal from "~/components/PopUpModal";
import Sidebar from "~/components/SideBar";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [overlayActive, setOverlayActive] = useState(false);

  const handleModalClose = () => {
    setIsModalVisible(false);
    setOverlayActive(false);
  };
  return (
    <>
      <div className="video-bg">
        <video width="320" height="240" autoPlay loop muted>
          <source src="https://assets.codepen.io/3364143/7btrrd.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className={`app ${overlayActive ? 'overlay-active' : ''}`}>
        <Header />
        <div className="wrapper">
          <Sidebar />
          <MainContainer />
        </div>
        {isModalVisible && <PopUpModal onClose={handleModalClose} />}
      </div>
      <ThemeToggle />
    </>
  );
}
