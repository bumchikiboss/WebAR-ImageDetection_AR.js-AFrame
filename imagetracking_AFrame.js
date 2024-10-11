document.addEventListener('DOMContentLoaded', () => {

    const model = document.querySelector('#model');
    const animations = ['Dog_Happy', 'Dog_Run_Arround'];

    // Play idle animation initially on loop
    const playIdleAnimation = () => {
      model.setAttribute('animation-mixer', {
        clip: 'Dog_Stand_Idle_01_Bot',
        loop: 'repeat',
        timeScale: 1
      });
    };

    // Play a random animation
    const playRandomAnimation = () => {
      const randomAnim = animations[Math.floor(Math.random() * animations.length)];


      model.setAttribute('animation-mixer', {
        clip: randomAnim,
        loop: 'once'
      });

      // Listen for the 'animation-finished' event
      model.addEventListener('animation-finished', (event) => {
        console.log('Random animation finished, going back to idle');
        playIdleAnimation();
      }, { once: true }); // listener is only triggered once
    };

    // tap interaction
    window.addEventListener('click', () => {
      console.log('Screen tapped, playing random animation');
      playRandomAnimation();
    });

});
