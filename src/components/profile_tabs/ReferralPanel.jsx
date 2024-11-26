import React, { useState, useEffect } from 'react';
import { InfoIcon, PlusReferral, CloseButton } from '../icons';
import ReferralInfoButton from './ReferralInfoButton';
import './ReferralPanel.css';

const ReferralPanel = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const avatarSvg = localStorage.getItem('avatar_svg');
  const nickname = localStorage.getItem('nickname');
  const referralLink = `https://t.me/testfromytka1_bot?start=${nickname}`;

  useEffect(() => {
    if (showLinkModal) {
      setTimeout(() => {
        setIsModalActive(true);
      }, 50);
    }
  }, [showLinkModal]);

  const handleInfoClick = () => {
    setShowInfo(true);
  };

  const handleReferralClick = () => {
    setShowLinkModal(true);
  };

  const handleModalClose = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowLinkModal(false);
      setIsModalClosing(false);
      setIsModalActive(false);
    }, 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="referral-panel">
        <button className="referral-info-button" onClick={handleInfoClick}>
          <InfoIcon />
        </button>

        <button className="referral-button" onClick={handleReferralClick}>
          <div className="referral-avatar-container">
            <div className="referral-avatar-blur" />
            <div
              className="referral-avatar"
              dangerouslySetInnerHTML={{ __html: avatarSvg }}
            />
            <div className="referral-plus-icon">
              <PlusReferral />
            </div>
          </div>
        </button>
      </div>

      {showInfo && <ReferralInfoButton onClose={() => setShowInfo(false)} />}

      {showLinkModal && (
        <div className={`referral-modal ${isModalActive ? 'active' : ''} ${isModalClosing ? 'closing' : ''}`}>
          <div className="modal-overlay" onClick={handleModalClose}></div>
          <div className="modal-blue-panel"></div>
          <div className="modal-dark-panel">
            <button className="modal-close-button" onClick={handleModalClose}>
              <CloseButton />
            </button>

            <div className="modal-content">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="referral-link-input"
              />
              <button
                className={`modal-button ${isCopied ? 'copied' : ''}`}
                onClick={handleCopy}
              >
                {isCopied ? 'Скопировано' : 'Скопировать'}
              </button>
              <button className="modal-button" onClick={handleModalClose}>
                Ок
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReferralPanel;