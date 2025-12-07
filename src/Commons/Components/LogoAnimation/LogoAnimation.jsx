import React from 'react';
import { motion } from 'framer-motion';
import './LogoAnimation.css';
import loadingVideo from '../../../Assets/loading.mp4';

const LogoAnimation = () => {
  return (
    <motion.div
      className="logoAnimation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <video
        className="loadingVideo"
        src={loadingVideo}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controls={false}
      />
    </motion.div>
  );
};

export default LogoAnimation;
