exports.validatedeadLine = async (req, res, next) => {
  const { deadLine } = req.body;
  if (!deadLine) {
    return next();
  }
  const regexDate = /^\d{4}-\d{2}-\d{2}$/;
  const regexDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

  if (
    typeof deadLine !== "string" ||
    (!regexDate.test(deadLine) && !regexDateTime.test(deadLine))
  ) {
    return res.status(400).json({
      error: "Invalid date format. Use YYYY-MM-DD or YYYY-MM-DDTHH:mm",
    });
  }

  let parsedDate;

  if (regexDate.test(deadLine)) {
    // YYYY-MM-DD
    const [year, month, day] = deadLine.split("-").map(Number);
    parsedDate = new Date(Date.UTC(year, month - 1, day));

    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() + 1 !== month ||
      parsedDate.getUTCDate() !== day
    ) {
      return res.status(400).json({ error: "Invalid calendar date" });
    }
  } else {
    // YYYY-MM-DDTHH:mm
    const [datePart, timePart] = deadLine.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hour, minute] = timePart.split(":").map(Number);

    // 1️⃣ Range checks
    if (
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31 ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return res.status(400).json({ error: "Invalid date/time values" });
    }

    parsedDate = new Date(Date.UTC(year, month - 1, day, hour, minute));

    // 2️⃣ Calendar validation
    if (
      parsedDate.getUTCFullYear() !== year ||
      parsedDate.getUTCMonth() + 1 !== month ||
      parsedDate.getUTCDate() !== day ||
      parsedDate.getUTCHours() !== hour ||
      parsedDate.getUTCMinutes() !== minute
    ) {
      return res.status(400).json({ error: "Invalid calendar date/time" });
    }
  }

  // Save as Date object
  req.body.deadLine = parsedDate;
  next();
};
