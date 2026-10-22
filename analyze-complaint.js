require("dotenv").config();

function extractLocation(description) {
  const match = description.match(
    /\b(?:[A-Z]\s*Block|Block\s*[A-Z])\s*(?:Room|Rm\.?)\s*\d+\b/i
  );

  return match ? match[0] : null;
}

function analyzeComplaint({
  description,
  imageUrl = null,
  location = null,
}) {
  const text = description.toLowerCase();

  let category = "Other";
  let subcategory = "General Issue";
  let priority = "MEDIUM";
  let department = "Maintenance";
  let suggested_action =
    "Inspect the reported issue and take the appropriate corrective action.";

  // -----------------------------
  // CATEGORY + DEPARTMENT
  // -----------------------------

  // Plumbing
  if (
    text.includes("leak") ||
    text.includes("water") ||
    text.includes("pipe") ||
    text.includes("tap") ||
    text.includes("faucet") ||
    text.includes("drain") ||
    text.includes("flush") ||
    text.includes("toilet")
  ) {
    category = "Plumbing";
    subcategory = "Water Leakage / Plumbing";
    department = "Maintenance";
    suggested_action =
      "Inspect the plumbing system, identify the source of the issue, and repair the affected pipe, tap, drain, or fixture.";
  }

  // Electrical
  else if (
    text.includes("electric") ||
    text.includes("electricity") ||
    text.includes("light") ||
    text.includes("bulb") ||
    text.includes("fan") ||
    text.includes("power") ||
    text.includes("socket") ||
    text.includes("switch") ||
    text.includes("wire") ||
    text.includes("voltage")
  ) {
    category = "Electrical";
    subcategory = "Electrical Issue";
    department = "Electrical";
    suggested_action =
      "Inspect the electrical connection and repair or replace the faulty component safely.";
  }

  // Internet / Network
  else if (
    text.includes("wifi") ||
    text.includes("wi-fi") ||
    text.includes("internet") ||
    text.includes("network") ||
    text.includes("router") ||
    text.includes("connection")
  ) {
    category = "Internet/Network";
    subcategory = "Network Connectivity";
    department = "IT";
    suggested_action =
      "Check the network connection and affected access point, router, or campus network service.";
  }

  // Software / Portal
  else if (
    text.includes("portal") ||
    text.includes("website") ||
    text.includes("software") ||
    text.includes("login") ||
    text.includes("password") ||
    text.includes("app") ||
    text.includes("application") ||
    text.includes("error message")
  ) {
    category = "Software/Portal";
    subcategory = "Software / Portal Issue";
    department = "IT";
    suggested_action =
      "Investigate the reported software or portal issue, verify the user's account, and resolve the underlying system problem.";
  }

  // Furniture
  else if (
    text.includes("chair") ||
    text.includes("desk") ||
    text.includes("table") ||
    text.includes("bench") ||
    text.includes("furniture") ||
    text.includes("cabinet") ||
    text.includes("drawer")
  ) {
    category = "Furniture";
    subcategory = "Damaged Furniture";
    department = "Maintenance";
    suggested_action =
      "Inspect the furniture and repair or replace the damaged component.";
  }

  // Cleaning
  else if (
    text.includes("dirty") ||
    text.includes("garbage") ||
    text.includes("trash") ||
    text.includes("dust") ||
    text.includes("waste") ||
    text.includes("cleaning") ||
    text.includes("unclean") ||
    text.includes("not cleaned")
  ) {
    category = "Cleaning";
    subcategory = "Cleaning Required";
    department = "Housekeeping";
    suggested_action =
      "Arrange housekeeping service to clean the reported area and dispose of any accumulated waste.";
  }

  // Hostel
  else if (
    text.includes("hostel") ||
    text.includes("warden") ||
    text.includes("hostel room") ||
    text.includes("room allocation") ||
    text.includes("mess")
  ) {
    category = "Hostel";
    subcategory = "Hostel Facility Issue";
    department = "Hostel Administration";
    suggested_action =
      "Review the hostel-related complaint and coordinate with the appropriate hostel staff for resolution.";
  }

  // Classroom
  else if (
    text.includes("classroom") ||
    text.includes("projector") ||
    text.includes("whiteboard") ||
    text.includes("blackboard") ||
    text.includes("lecture hall")
  ) {
    category = "Classroom";
    subcategory = "Classroom Facility Issue";
    department = "Maintenance";
    suggested_action =
      "Inspect the classroom facility and repair or restore the affected equipment or infrastructure.";
  }

  // Security
  else if (
    text.includes("security") ||
    text.includes("cctv") ||
    text.includes("theft") ||
    text.includes("intruder") ||
    text.includes("unauthorized") ||
    text.includes("lock")
  ) {
    category = "Security";
    subcategory = "Security Concern";
    department = "Hostel Administration";
    suggested_action =
      "Review the reported security concern and escalate it to the responsible campus security personnel.";
  }

  // -----------------------------
  // PRIORITY
  // -----------------------------

  if (
    text.includes("fire") ||
    text.includes("smoke") ||
    text.includes("spark") ||
    text.includes("flood") ||
    text.includes("burst pipe") ||
    text.includes("exposed wire") ||
    text.includes("gas leak") ||
    text.includes("danger") ||
    text.includes("dangerous") ||
    text.includes("emergency") ||
    text.includes("security threat")
  ) {
    priority = "URGENT";
  } else if (
      text.includes("unsafe") ||
      text.includes("not working") ||
      text.includes("broken") ||
      text.includes("no electricity") ||
      text.includes("no power") ||
      text.includes("internet down") ||
      text.includes("major leak") ||
      text.includes("cannot access") ||
      text.includes("entire block") ||
      text.includes("whole block") ||
      text.includes("entire hostel") ||
      text.includes("whole hostel") ||
      text.includes("everyone") ||
      text.includes("all students") ||
      text.includes("campus-wide") ||
      text.includes("campus wide")
    ) {
      priority = "HIGH";
  } else if (
    text.includes("minor") ||
    text.includes("small") ||
    text.includes("cosmetic") ||
    text.includes("stain")
  ) {
    priority = "LOW";
  }

  // -----------------------------
  // LOCATION
  // -----------------------------

  const finalLocation =
    location || extractLocation(description);

  // -----------------------------
  // SUMMARY
  // -----------------------------

  const summary =
    `Reported ${subcategory.toLowerCase()} in ${finalLocation || "the campus"}. ` +
    `The issue has been classified under ${category} and routed to ${department}.`;

  // -----------------------------
  // EMAIL
  // -----------------------------

  const email_subject =
    `[${priority}] Campus Issue - ${subcategory}`;

  const email_body =
    `Dear ${department} Team,\n\n` +
    `A campus issue has been reported and automatically classified by CampusFix.\n\n` +
    `Issue: ${description}\n` +
    `Category: ${category}\n` +
    `Subcategory: ${subcategory}\n` +
    `Priority: ${priority}\n` +
    `Location: ${finalLocation || "Not provided"}\n\n` +
    `Suggested action:\n${suggested_action}\n\n` +
    `Please investigate and take the necessary action.\n\n` +
    `Regards,\nCampusFix`;

  return {
    category,
    subcategory,
    priority,
    department,
    location: finalLocation,
    summary,
    suggested_action,
    email_subject,
    email_body,
    image_provided: Boolean(imageUrl),
  };
}

// Test
const result = analyzeComplaint({
  description:
    "There is water leaking from the ceiling in C Block Room 204. The floor is getting flooded.",
});

console.log(JSON.stringify(result, null, 2));

module.exports = { analyzeComplaint };