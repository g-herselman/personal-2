const initClock = () => {
  const date = new Date();
  const animationStartTimeByType = {
    hours: (date.getHours() % 12) * 3600 * -1,
    minutes: date.getMinutes() * 60 * -1,
    seconds: date.getSeconds() * -1,
  };

  document
    .querySelectorAll("[data-clockhand-type]")
    .forEach((animationNode) => {
      const type = animationNode.getAttribute("data-clockhand-type");

      console.log(type, animationStartTimeByType[type]);

      animationNode.beginElementAt(animationStartTimeByType[type]);
    });
};
