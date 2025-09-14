import React, { useEffect, useRef } from 'react';

const ThreeBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.5; 

      video.play().catch((error) => {
        console.warn('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      <video
        ref={videoRef}
        src="https://framerusercontent.com/assets/TKJh7n9zrY79rNGE3m5p5xMNY.mp4"
        loop
        muted
        playsInline
        className="w-full h-full object-cover blur-md brightness-500 opacity-30"
      />
    </div>
  );
};

export default ThreeBackground;