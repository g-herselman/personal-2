/* 
SVG Specifications for the 'begin' property on animate gives the following syntax option:

> https://svgwg.org/specs/animations/#TimingAttributes
> wallclock-sync-value ::= "wallclock(" wallclock-value ")"
> Describes the element begin as a real-world clock time. The wallclock time syntax is based upon syntax defined in Representation of dates and times [ISO8601].

Unfortunately, this has never been implemented in any browser and likely won't be. 
This limited shim replaces 'wallclock-sync-value' definitions with their equivalents in time offset values.

Some major caveats: 
 - Does not take date components of wallclock-value into account. I did not want BigInt to be involved with this.
 - Only works with embedded SVGs that are available on document ready.
 - Only works on 'begin' attributes

 The last limitation can be worked around at a later stage.
*/

(() => {
  const animateTransforms = document.querySelectorAll(
    "svg animate,animateMotion,animateTransform"
  );

  const currentDate = new Date();

  const wallclockRegex = /wallclock\((.*)\)/;

  const getMillisecondsSinceDayStart = (validDate) => {
    const hoursSinceStart = validDate.getHours();
    const minutesSinceStart = validDate.getMinutes() + hoursSinceStart * 60;
    const secondsSinceStart = validDate.getSeconds() + minutesSinceStart * 60;
    return validDate.getMilliseconds() + secondsSinceStart * 1000;
  };

  animateTransforms.forEach((animateTransformElement) => {
    const currentBeginAttributeValue =
      animateTransformElement.getAttribute("begin");

    if (currentBeginAttributeValue === null) return;
    if (!wallclockRegex.test(currentBeginAttributeValue)) return;

    const execResult = wallclockRegex.exec(currentBeginAttributeValue);

    const [_, wallclockTimeValue] = execResult;

    const sanitizedWallClockTimeValue = wallclockTimeValue.replace(
      /[^\d:]/g,
      ""
    );

    const wallClockDateIsoString = currentDate
      .toISOString()
      .replace(/T(.*)Z/, `T${sanitizedWallClockTimeValue}`);

    const wallClockDate = new Date(wallClockDateIsoString);

    if (Number.isNaN(wallClockDate.getHours())) return;

    const wallClockDateInMilliseconds =
      getMillisecondsSinceDayStart(wallClockDate);
    const currentDateInMilliseconds = getMillisecondsSinceDayStart(currentDate);

    const differenceInMilliseconds =
      wallClockDateInMilliseconds - currentDateInMilliseconds;

    const newBeginAttributeValue = differenceInMilliseconds / 1000 + "s";

    animateTransformElement.setAttribute("begin", newBeginAttributeValue);

    const refreshElement = () =>
      animateTransformElement.replaceWith(animateTransformElement); // Replace the element with itself to retrigger the animation.

    refreshElement();

    document.addEventListener("focus", refreshElement); // Animations will pause when document is not in focus. Refresh the element when the document regains focus
  });
})();
