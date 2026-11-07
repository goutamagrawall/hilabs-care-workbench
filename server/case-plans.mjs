export default {
  "M-1006": {
    "signal": "Tomorrow’s infusion · access unresolved",
    "deadline": "08:30",
    "trust": "Separate source statuses",
    "why": "The Nov 10, 09:00 ET infusion is scheduled. Payer authorization is pending, transport is unconfirmed, and the oncology team owns readiness decisions.",
    "next": "Check authorization with UM and oncology now, then coordinate transport and permitted member outreach.",
    "evidence": [
      "R053",
      "R054",
      "R055",
      "R057",
      "R058",
      "R059"
    ],
    "contact": "Phone preferred 15:00–18:00 ET. Permission is recorded. Coordinate with UM and oncology before the call window.",
    "tasks": [
      [
        "Verify infusion authorization",
        "Maria / payer UM",
        "R055",
        "Payer determination reference"
      ],
      [
        "Confirm next steps with oncology",
        "Maria / oncology team",
        "R054",
        "Treating-team confirmation"
      ],
      [
        "Verify transport for Nov 10",
        "Care coordinator",
        "R059",
        "Confirmed ride or alternative"
      ],
      [
        "Follow up with member in preferred window",
        "Maria",
        "R057",
        "Documented contact outcome"
      ]
    ]
  },
  "M-1005": {
    "signal": "Home health authorized · start unconfirmed",
    "deadline": "09:00",
    "trust": "Separate source statuses",
    "why": "Payer UM approved the evaluation, but agency onboarding is pending. The authorized caregiver reported strain.",
    "next": "Confirm start of care with the agency and coordinate support with the authorized caregiver.",
    "evidence": [
      "R043",
      "R046",
      "R047",
      "R048"
    ],
    "contact": "Caregiver consent is recorded. Verify identity and scope before sharing information.",
    "tasks": [
      [
        "Confirm agency start of care",
        "Maria / home-health agency",
        "R047",
        "Actual start-of-care date or agency disposition"
      ],
      [
        "Review caregiver support",
        "Maria / authorized caregiver",
        "R048",
        "Documented support plan and caregiver confirmation"
      ]
    ],
    "caregiver": true
  },
  "M-1001": {
    "signal": "Discharge medication discrepancy",
    "deadline": "10:00",
    "trust": "Conflicting",
    "why": "The hospital discharge record lists torsemide 20 mg daily. The earlier outpatient list and visible fill list 10 mg. A follow-up visit and post-discharge fill are unconfirmed.",
    "next": "Verify the intended regimen with the prescribing team, then confirm access and follow-up.",
    "evidence": [
      "R002",
      "R003",
      "R005",
      "R006",
      "R007"
    ],
    "contact": "Prior voicemail. Confirm the current number and permitted channel before the next attempt.",
    "tasks": [
      [
        "Reconcile intended torsemide regimen",
        "Maria / prescribing team",
        "R003",
        "Prescribing-team confirmation"
      ],
      [
        "Confirm medication access and follow-up",
        "Maria / pharmacy and clinic",
        "R007",
        "Member or provider confirmation"
      ]
    ]
  },
  "M-1002": {
    "signal": "Recent ED alert · disconnected phone",
    "deadline": "11:00",
    "trust": "Incomplete",
    "why": "The new ED alert omits reason and disposition. Prior asthma history and a delayed claim do not establish what happened at this encounter.",
    "next": "Request ED details through the hospital or HIE and verify an authorized contact route.",
    "evidence": [
      "R012",
      "R013",
      "R014",
      "R017",
      "R018"
    ],
    "contact": "Primary number disconnected. Do not retry. Verify an authorized route through member services before outreach.",
    "tasks": [
      [
        "Request ED encounter details",
        "Maria / hospital HIE",
        "R012",
        "ED note or hospital confirmation"
      ],
      [
        "Verify a permitted member contact route",
        "Member services",
        "R017",
        "Verified channel and contact permission"
      ]
    ],
    "blocked": true
  },
  "M-1003": {
    "signal": "Possible refill gap · missed follow-up",
    "deadline": "15:00",
    "trust": "Incomplete",
    "why": "HbA1c was 10.2% and the connected scheduler records a no-show. Pharmacy coverage is incomplete. The March food-access screen needs refreshing.",
    "next": "Confirm medication supply and affordability with the member and coordinate diabetes follow-up.",
    "evidence": [
      "R023",
      "R025",
      "R026",
      "R027",
      "R028"
    ],
    "contact": "Prior attempt reached voicemail. Verify current contact details before outreach.",
    "tasks": [
      [
        "Confirm medication access and barriers",
        "Maria / pharmacy",
        "R025",
        "Member or pharmacy verification"
      ],
      [
        "Coordinate diabetes follow-up",
        "Maria / PCP scheduling",
        "R027",
        "Updated visit outcome"
      ]
    ]
  },
  "M-1004": {
    "signal": "Interpreter needed · referral unconfirmed",
    "deadline": "16:00",
    "trust": "Restricted / incomplete",
    "why": "The member confirmed Spanish and requested an interpreter. The older CRM language conflicts. The counseling referral is placed and its outcome is unknown.",
    "next": "Use interpreter-supported outreach and confirm counseling and housing support through permitted channels.",
    "evidence": [
      "R032",
      "R033",
      "R034",
      "R035",
      "R037",
      "R039"
    ],
    "contact": "Spanish interpreter requested. Verify the permitted channel and record interpreter support for a connected encounter.",
    "tasks": [
      [
        "Arrange interpreter-supported outreach",
        "Maria / language services",
        "R033",
        "Interpreter and contact outcome"
      ],
      [
        "Verify counseling referral outcome",
        "Behavioral-health team",
        "R035",
        "Partner or member confirmation"
      ]
    ],
    "interpreter": true
  }
};
