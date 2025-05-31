(() => {
  const date = new Date();

  const convertToPortionOfDegrees = (current, end) => (current / end) * 360;

  const animationStartPositionByType = {
    hours: convertToPortionOfDegrees(date.getHours() % 12, 12),
    minutes: convertToPortionOfDegrees(date.getMinutes(), 60),
    seconds: convertToPortionOfDegrees(date.getSeconds(), 60),
  };

  const updateAnimationRotationDegrees = (
    animationNode,
    attributeName,
    degrees
  ) => {
    const currentValue = animationNode.getAttribute(attributeName);
    const newValue = currentValue
      .split(" ")
      .map((v, i) => (i === 0 ? `${degrees}` : v))
      .join(" ");
    animationNode.setAttribute(attributeName, newValue);
  };

  document
    .querySelectorAll("[data-clockhand-type]")
    .forEach((animationNode) => {
      const type = animationNode.getAttribute("data-clockhand-type");

      const startPosition = animationStartPositionByType[type];
      updateAnimationRotationDegrees(animationNode, "from", startPosition);

      const endPosition = animationStartPositionByType[type] + 360;
      updateAnimationRotationDegrees(animationNode, "to", endPosition);

      animationNode.beginElement();
    });
})();
