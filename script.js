// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {

  // Define video element and section
  const vid = document.querySelector('.playing-video-tag');
  const section = document.querySelector('.page-holder');
  const contentHolders = document.querySelectorAll('.content-holder');

  // Calculate duration for each content section
  const totalVideoDuration = 24; // Total duration of the video in seconds
  const sectionDuration = totalVideoDuration / contentHolders.length;

  // Function to update video playback and active content section based on scroll position
  const updateVideoPlaybackAndContent = () => {
    const distance = window.scrollY - section.offsetTop;
    const total = section.clientHeight - window.innerHeight;
    let percentage = distance / total;
    percentage = Math.max(0, percentage);
    percentage = Math.min(percentage, 1);

    // Update video playback
    if (vid.duration > 0) {
      vid.currentTime = vid.duration * percentage;
    }

    // Update active content section based on video playback
    const activeContentIndex = Math.floor((vid.currentTime / totalVideoDuration) * contentHolders.length);
    contentHolders.forEach((contentHolder, index) => {
      contentHolder.classList.toggle('active', index === activeContentIndex);
    });
  };

  // ScrollTrigger to control video playback and active content section
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: updateVideoPlaybackAndContent,
    // Adjust steps for smoother animation
    snap: {
      snapTo: 'labels', // Snap to labels for smoother animation
      duration: {min: 0.01, max: 0.05}, // Adjust duration for smoother animation
      delay: 0.02, // Adjust delay for smoother animation
      ease: "power4.inOut", // Use power4 easing for smoother animation
    }
  });

  // GSAP animations for content holders
  contentHolders.forEach((contentHolder, index) => {
    // Animate enter with bounce effect
    gsap.from(contentHolder, {
      opacity: 0,
      y: 50,
      duration: 0.5,
      ease: "bounce",
      scrollTrigger: {
        trigger: contentHolder,
        start: 'top bottom', // Animation starts when content holder enters the viewport
        end: 'bottom top', // Animation ends when content holder exits the viewport
        scrub: true // Smooth transition as the content holder scrolls
      }
    });

    // Animate exit with fade out effect
    gsap.to(contentHolder, {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: contentHolder,
        start: 'bottom bottom-=15%', // Animation starts when content holder reaches the bottom of the viewport
        end: 'bottom top', // Animation ends when content holder exits the viewport
        scrub: true, // Smooth transition as the content holder scrolls
      }
    });
  });

  // Pause the video initially
  vid.pause();

  // Event listener to play/pause video when scrolling within section
  section.addEventListener('scroll', () => {
    if (ScrollTrigger.getById(section.id).isActive()) {
      vid.play();
    } else {
      vid.pause();
    }
  });
});
