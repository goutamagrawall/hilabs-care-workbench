(() => {
  // server/seed.mjs
  var seed_default = {
    "cases": [
      [
        "M-1001",
        "Evelyn Moore",
        "72",
        "Heart failure discharge",
        "P1 - Today",
        "Hospital discharge + possible medication access gap",
        "Discharge torsemide 20 mg vs older outpatient 10 mg; no newer fill visible; transport screen stale",
        "Recent discharge; possible medication-change / refill gap; follow-up not visible in connected schedule",
        "Verify discharge regimen and medication access; reach member; coordinate follow-up and transport",
        "Do not assert medication nonadherence or absent appointment without confirmation",
        "Member 360; Medication conflict; Freshness; Next best action; Outreach; Documentation",
        "Member;Hospital_ADT;Discharge;Clinical;Medication;Pharmacy;Appointments;SDOH;Outreach;CarePlan",
        "10"
      ],
      [
        "M-1002",
        "Marcus Hill",
        "47",
        "Frequent ED use / asthma",
        "P1 - Today",
        "Recent ED alert + failed outreach",
        "ADT diagnosis missing; lagging claim; disconnected phone; unstable housing",
        "Recent ED visit requiring clarification; current primary contact unusable",
        "Clarify recent encounter with hospital/HIE; verify permitted alternate channel; assess asthma and housing needs",
        "Do not infer current exacerbation diagnosis from diagnosis-free alert",
        "Member 360; Missing data; Freshness; Prioritization; Outreach; Documentation",
        "Member;Hospital_ADT;Claims;Clinical;Medication;Pharmacy;Contact;Outreach;SDOH;CarePlan",
        "10"
      ],
      [
        "M-1003",
        "Daniel Reed",
        "59",
        "Diabetes / refill uncertainty",
        "P2 - Today",
        "Elevated HbA1c + possible refill lapse",
        "Incomplete PBM feed; medical claim posted late; older social-needs screen",
        "Uncontrolled diabetes and no recent fill in available feed; needs verification",
        "Contact member to confirm regimen, medication access and missed diabetes follow-up",
        "Do not claim the patient stopped medication because a PBM record is missing",
        "Member 360; Missing data; Freshness; Next best action; Outreach; Documentation",
        "Member;Clinical;Labs;Medication;Pharmacy;Claims;Appointments;SDOH;Outreach;CarePlan",
        "10"
      ],
      [
        "M-1004",
        "Sofia Ramirez",
        "36",
        "Behavioral health + housing instability",
        "P2 - Today",
        "Unresolved behavioral health referral + unsafe outreach assumptions",
        "CRM language English vs patient-stated Spanish; restricted note missing; referral outcome unknown",
        "Communication mismatch and incomplete care-coordination loop for time-sensitive referral",
        "Use verified Spanish-language contact preference, verify permitted outreach, confirm referral progress and housing resources",
        "Do not expose restricted behavioral-health content or assume referral was completed",
        "Member 360; Conflicts; Privacy; Outreach; Referrals; Documentation",
        "Member;Contact;Clinical;Referral;Outreach;SDOH;CarePlan;Appointments;Authorization;CareTeam",
        "10"
      ],
      [
        "M-1005",
        "Grace Turner",
        "82",
        "COPD + CKD / caregiver strain",
        "P1 - Today",
        "Post-discharge home health service may not have started",
        "Payer authorized service, agency still reports onboarding pending; caregiver overwhelmed",
        "Approval is not equivalent to home-health service started",
        "Contact home-health agency and caregiver (within consent); confirm start-of-care and escalate service gap",
        "Do not mark home-health complete because the authorization is approved",
        "Member 360; Conflicts; Closed-loop tracking; Outreach; Next best action; Documentation",
        "Member;Hospital_ADT;Discharge;Clinical;Labs;Authorization;HomeHealth;Outreach;SDOH;CarePlan",
        "10"
      ],
      [
        "M-1006",
        "Nina Shah",
        "55",
        "Colorectal cancer / infusion access",
        "P1 - Today",
        "Tomorrow infusion scheduled; authorization pending; transport unresolved",
        "Oncology schedule says confirmed but insurer authorization pending; older CBC; transport issue",
        "Time-sensitive oncology visit may face administrative and transportation barriers",
        "Confirm authorization with UM and oncology site; verify whether pre-treatment labs are adequate per oncology team; arrange transport",
        "Do not assert treatment cancellation or change oncology regimen independently",
        "Member 360; Authorization conflict; Timeliness; SDOH; Prioritization; Documentation",
        "Member;Clinical;Labs;Appointments;Authorization;Pharmacy;Contact;Outreach;SDOH;CarePlan",
        "10"
      ]
    ],
    "records": [
      [
        "R001",
        "M-1001",
        "Member",
        "Payer enrollment",
        "2026-11-01 09:00",
        "2026-11-01 09:02",
        "Eligibility",
        "Active MA plan; fictional member; age 72",
        "Verified",
        "Authoritative payer member ID",
        ""
      ],
      [
        "R002",
        "M-1001",
        "Hospital_ADT",
        "Hospital A / HIE",
        "2026-11-06 13:45",
        "2026-11-06 14:00",
        "Discharge event",
        "Discharged following heart-failure-related admission",
        "Verified",
        "Recent clinical event",
        ""
      ],
      [
        "R003",
        "M-1001",
        "Discharge",
        "Hospital A EHR",
        "2026-11-06 13:00",
        "2026-11-08 10:00",
        "Medication at discharge",
        "Torsemide 20 mg orally daily; verify against discharge instructions",
        "Delayed",
        "Document arrived two days after discharge",
        "Keep original summary + timestamp"
      ],
      [
        "R004",
        "M-1001",
        "Clinical",
        "Outpatient EHR",
        "2026-10-20 11:00",
        "2026-10-22 13:00",
        "Problem list",
        "Heart failure; hypertension",
        "Verified",
        "",
        ""
      ],
      [
        "R005",
        "M-1001",
        "Medication",
        "Outpatient EHR",
        "2026-10-29 10:00",
        "2026-10-29 10:08",
        "Outpatient medication",
        "Torsemide 10 mg orally daily",
        "Conflict",
        "Older than hospital discharge medication; may be intentional change",
        "Show both doses; clinician reconciliation"
      ],
      [
        "R006",
        "M-1001",
        "Pharmacy",
        "PBM fill feed",
        "2026-10-08 17:00",
        "2026-10-09 02:00",
        "Last visible fill",
        "Torsemide 10 mg, 30-day supply; no post-discharge fill visible as of 2026-11-09 07:00",
        "Incomplete",
        "Cash fills/external pharmacy may be absent",
        "Label unverified fill gap"
      ],
      [
        "R007",
        "M-1001",
        "Appointments",
        "Partner scheduling",
        "2026-11-08 18:00",
        "2026-11-08 18:02",
        "Follow-up schedule status",
        "No follow-up in connected scheduling feed",
        "Incomplete",
        "External appointments may not be visible",
        "Confirm with patient/provider"
      ],
      [
        "R008",
        "M-1001",
        "SDOH",
        "Health risk assessment",
        "2026-02-18 15:00",
        "2026-02-18 15:05",
        "Transportation",
        "Reported occasional transportation difficulty",
        "Stale",
        "Screen was ~9 months ago",
        "Reassess barriers"
      ],
      [
        "R009",
        "M-1001",
        "Outreach",
        "Case CRM",
        "2026-11-06 16:00",
        "2026-11-06 16:02",
        "Previous call",
        "Voicemail; no patient contact",
        "Verified",
        "",
        ""
      ],
      [
        "R010",
        "M-1001",
        "CarePlan",
        "Case-management system",
        "2026-11-06 16:20",
        "2026-11-06 16:20",
        "Open task",
        "Medication reconciliation and post-discharge follow-up; owner Maria",
        "Verified",
        "",
        ""
      ],
      [
        "R011",
        "M-1002",
        "Member",
        "Payer enrollment",
        "2026-11-01 10:00",
        "2026-11-01 10:00",
        "Eligibility",
        "Active marketplace plan; age 47",
        "Verified",
        "",
        ""
      ],
      [
        "R012",
        "M-1002",
        "Hospital_ADT",
        "Hospital B / HIE",
        "2026-11-07 21:15",
        "2026-11-08 00:40",
        "ED encounter alert",
        "ED encounter; diagnosis omitted; discharge status unknown",
        "Missing",
        "ADT received without chief complaint or discharge confirmation",
        "Request encounter details"
      ],
      [
        "R013",
        "M-1002",
        "Claims",
        "Payer adjudication",
        "2026-09-19 16:00",
        "2026-11-03 08:00",
        "Last posted claim",
        "ED visit September 19; October/November encounters not yet reflected",
        "Delayed",
        "Claims lag > 40 days",
        "Do not use claims for immediate clinical status"
      ],
      [
        "R014",
        "M-1002",
        "Clinical",
        "Prior provider EHR",
        "2026-10-01 10:00",
        "2026-10-08 08:00",
        "Clinical conditions",
        "Asthma; prior frequent ED utilization",
        "Verified",
        "",
        ""
      ],
      [
        "R015",
        "M-1002",
        "Medication",
        "Outpatient EHR",
        "2026-10-01 10:10",
        "2026-10-08 08:00",
        "Controller prescription",
        "Fluticasone/salmeterol prescribed; current regimen needs confirmation",
        "Provisional",
        "",
        ""
      ],
      [
        "R016",
        "M-1002",
        "Pharmacy",
        "PBM fill feed",
        "2026-10-05 12:00",
        "2026-10-06 04:00",
        "Visible pharmacy claim",
        "Controller medication fill from October; current supply uncertain",
        "Incomplete",
        "",
        ""
      ],
      [
        "R017",
        "M-1002",
        "Contact",
        "Payer CRM",
        "2026-11-05 14:00",
        "2026-11-05 14:02",
        "Primary number",
        "202-555-0112 disconnected on verification",
        "Conflict",
        "Existing CRM record marked active but verification failed",
        "Suppress invalid number"
      ],
      [
        "R018",
        "M-1002",
        "Outreach",
        "Case CRM",
        "2026-11-06 17:00",
        "2026-11-06 17:00",
        "Contact attempt",
        "3 calls in 7 days, none connected; most recent line disconnected",
        "Verified",
        "",
        ""
      ],
      [
        "R019",
        "M-1002",
        "SDOH",
        "Patient assessment",
        "2026-10-18 09:30",
        "2026-10-18 09:30",
        "Housing",
        "Unstable temporary housing; alternate contact permissions not documented",
        "Verified",
        "",
        ""
      ],
      [
        "R020",
        "M-1002",
        "CarePlan",
        "Case-management system",
        "2026-11-08 08:00",
        "2026-11-08 08:01",
        "Open task",
        "Clarify ED event; verify outreach permissions and possible alternate method",
        "Verified",
        "",
        ""
      ],
      [
        "R021",
        "M-1003",
        "Member",
        "Payer enrollment",
        "2026-11-01 09:00",
        "2026-11-01 09:00",
        "Eligibility",
        "Active employer plan; age 59",
        "Verified",
        "",
        ""
      ],
      [
        "R022",
        "M-1003",
        "Clinical",
        "PCP EHR",
        "2026-10-20 11:00",
        "2026-10-20 12:00",
        "Condition",
        "Type 2 diabetes; long-term glucose management",
        "Verified",
        "",
        ""
      ],
      [
        "R023",
        "M-1003",
        "Labs",
        "Outpatient lab",
        "2026-10-30 08:30",
        "2026-10-30 15:00",
        "HbA1c",
        "10.2%; elevated; clinical context needed",
        "Verified",
        "Value is a fictional clinical observation",
        ""
      ],
      [
        "R024",
        "M-1003",
        "Medication",
        "PCP EHR",
        "2026-10-20 11:10",
        "2026-10-20 11:12",
        "Medication order",
        "Metformin 1000 mg orally twice daily; verify actual use",
        "Verified",
        "",
        ""
      ],
      [
        "R025",
        "M-1003",
        "Pharmacy",
        "PBM fill feed",
        "2026-09-15 13:00",
        "2026-09-16 06:00",
        "Last visible claim",
        "Metformin 30-day supply; later partner feed may be incomplete",
        "Incomplete",
        "Data coverage issue, not proof of nonadherence",
        "Flag coverage unknown"
      ],
      [
        "R026",
        "M-1003",
        "Claims",
        "Payer adjudication",
        "2026-09-25 12:00",
        "2026-11-04 10:00",
        "Claim",
        "Office follow-up claim posted 40 days after service",
        "Delayed",
        "",
        ""
      ],
      [
        "R027",
        "M-1003",
        "Appointments",
        "Provider scheduling",
        "2026-11-05 10:00",
        "2026-11-05 10:10",
        "Visit outcome",
        "Diabetes follow-up appointment marked no-show",
        "Verified",
        "Confirm reason for missed appointment",
        ""
      ],
      [
        "R028",
        "M-1003",
        "SDOH",
        "Health risk assessment",
        "2026-03-02 16:00",
        "2026-03-02 16:05",
        "Food access",
        "Food insecurity screen positive; not reassessed since March",
        "Stale",
        "",
        ""
      ],
      [
        "R029",
        "M-1003",
        "Outreach",
        "Case CRM",
        "2026-11-06 14:00",
        "2026-11-06 14:05",
        "Contact attempt",
        "Voicemail after no-show appointment",
        "Verified",
        "",
        ""
      ],
      [
        "R030",
        "M-1003",
        "CarePlan",
        "Case-management system",
        "2026-11-06 15:00",
        "2026-11-06 15:00",
        "Open task",
        "Check medication access; reschedule follow-up; reassess food access",
        "Verified",
        "",
        ""
      ],
      [
        "R031",
        "M-1004",
        "Member",
        "Payer enrollment",
        "2026-11-01 09:00",
        "2026-11-01 09:01",
        "Eligibility",
        "Active Medicaid managed care; age 36",
        "Verified",
        "",
        ""
      ],
      [
        "R032",
        "M-1004",
        "Contact",
        "Payer CRM",
        "2026-09-01 10:00",
        "2026-09-01 10:01",
        "Recorded language",
        "English recorded as preferred language",
        "Conflict",
        "Contradicts verified patient preference",
        "Do not automatically overwrite; flag and confirm"
      ],
      [
        "R033",
        "M-1004",
        "Contact",
        "Patient case assessment",
        "2026-10-20 12:00",
        "2026-10-20 12:01",
        "Confirmed language",
        "Spanish preferred for clinical communication; interpreter requested",
        "Verified",
        "",
        ""
      ],
      [
        "R034",
        "M-1004",
        "Clinical",
        "Behavioral health partner",
        "2026-11-04 09:00",
        "2026-11-04 10:00",
        "Shared clinical summary",
        "Depression-related care coordination flag; detailed note not shared",
        "Restricted",
        "Additional permission checks before access",
        "Do not expose unavailable sensitive note"
      ],
      [
        "R035",
        "M-1004",
        "Referral",
        "Behavioral health referral system",
        "2026-11-04 10:00",
        "2026-11-05 08:30",
        "Referral",
        "Counseling referral placed; attendance outcome unknown",
        "Incomplete",
        "Placed does not mean completed",
        ""
      ],
      [
        "R036",
        "M-1004",
        "Outreach",
        "Case CRM",
        "2026-11-06 16:00",
        "2026-11-06 16:01",
        "Outreach event",
        "English-language call reached voicemail",
        "Conflict",
        "Did not follow verified Spanish preference",
        ""
      ],
      [
        "R037",
        "M-1004",
        "SDOH",
        "Member self-report",
        "2026-11-03 11:00",
        "2026-11-03 11:01",
        "Housing",
        "Temporarily staying with friends; requests housing resource help",
        "Verified",
        "",
        ""
      ],
      [
        "R038",
        "M-1004",
        "CarePlan",
        "Case-management system",
        "2026-11-05 09:00",
        "2026-11-05 09:01",
        "Open task",
        "Spanish-language outreach; verify counseling referral; provide housing resource options",
        "Verified",
        "",
        ""
      ],
      [
        "R039",
        "M-1004",
        "Appointments",
        "Partner schedule",
        "2026-11-07 18:00",
        "2026-11-07 18:01",
        "Counseling scheduling",
        "No verified attendance outcome in connected schedule",
        "Incomplete",
        "",
        ""
      ],
      [
        "R040",
        "M-1004",
        "CareTeam",
        "Case-management directory",
        "2026-11-05 11:00",
        "2026-11-05 11:01",
        "Assigned care navigator",
        "Language-capable navigator assigned; access within role permissions",
        "Verified",
        "",
        ""
      ],
      [
        "R041",
        "M-1005",
        "Member",
        "Payer enrollment",
        "2026-11-01 09:00",
        "2026-11-01 09:00",
        "Eligibility",
        "Active Medicare Advantage; age 82",
        "Verified",
        "",
        ""
      ],
      [
        "R042",
        "M-1005",
        "Hospital_ADT",
        "Hospital C / HIE",
        "2026-11-04 12:45",
        "2026-11-04 13:00",
        "Discharge alert",
        "Discharged after COPD exacerbation",
        "Verified",
        "",
        ""
      ],
      [
        "R043",
        "M-1005",
        "Discharge",
        "Hospital C EHR",
        "2026-11-04 12:00",
        "2026-11-05 09:00",
        "Discharge instruction",
        "Home-health nursing evaluation requested",
        "Verified",
        "",
        ""
      ],
      [
        "R044",
        "M-1005",
        "Clinical",
        "Outpatient EHR",
        "2026-10-31 09:00",
        "2026-11-01 09:00",
        "Conditions",
        "COPD and chronic kidney disease, stage 3",
        "Verified",
        "",
        ""
      ],
      [
        "R045",
        "M-1005",
        "Labs",
        "Laboratory",
        "2026-10-31 09:30",
        "2026-10-31 16:30",
        "eGFR",
        "41 mL/min/1.73 m2 (fictional); clinician interpretation needed",
        "Verified",
        "",
        ""
      ],
      [
        "R046",
        "M-1005",
        "Authorization",
        "Payer UM",
        "2026-11-05 13:00",
        "2026-11-05 13:04",
        "Home health approval",
        "Authorized for home-health evaluation",
        "Conflict",
        "Approval != actual start of service",
        "Show separate service status"
      ],
      [
        "R047",
        "M-1005",
        "HomeHealth",
        "Home-health agency",
        "2026-11-07 14:00",
        "2026-11-07 14:20",
        "Start of care",
        "Agency onboarding pending; no confirmed start-of-care visit",
        "Conflict",
        "Service status conflicts with assumption that authorized = delivered",
        "Contact agency"
      ],
      [
        "R048",
        "M-1005",
        "Outreach",
        "Case CRM",
        "2026-11-07 16:00",
        "2026-11-07 16:01",
        "Caregiver report",
        "Authorized caregiver reports feeling overwhelmed; consent on file",
        "Verified",
        "",
        ""
      ],
      [
        "R049",
        "M-1005",
        "SDOH",
        "Member assessment",
        "2026-11-07 16:00",
        "2026-11-07 16:02",
        "Caregiver needs",
        "Needs caregiver relief and safe home support plan",
        "Verified",
        "",
        ""
      ],
      [
        "R050",
        "M-1005",
        "CarePlan",
        "Case-management system",
        "2026-11-07 16:30",
        "2026-11-07 16:31",
        "Open task",
        "Confirm agency first visit and caregiver support before closing task",
        "Verified",
        "",
        ""
      ],
      [
        "R051",
        "M-1006",
        "Member",
        "Payer enrollment",
        "2026-11-01 09:00",
        "2026-11-01 09:01",
        "Eligibility",
        "Active employer plan; age 55",
        "Verified",
        "",
        ""
      ],
      [
        "R052",
        "M-1006",
        "Clinical",
        "Oncology EHR",
        "2026-11-03 11:00",
        "2026-11-03 11:30",
        "Condition and care context",
        "Stage III colorectal cancer; systemic therapy overseen by oncology team",
        "Verified",
        "Treatment details must be verified with oncology team",
        ""
      ],
      [
        "R053",
        "M-1006",
        "Labs",
        "Oncology lab",
        "2026-11-02 08:00",
        "2026-11-02 13:30",
        "CBC timing",
        "Last CBC available November 2; readiness requirements not known to payer",
        "Incomplete",
        "Do not infer whether another lab is clinically required",
        "Check with oncology"
      ],
      [
        "R054",
        "M-1006",
        "Appointments",
        "Oncology scheduling",
        "2026-11-08 12:00",
        "2026-11-08 12:03",
        "Infusion appointment",
        "Infusion scheduled November 10 at 09:00 ET; appointment confirmed",
        "Conflict",
        "Scheduling status does not prove coverage or clinical clearance",
        "Show alongside authorization"
      ],
      [
        "R055",
        "M-1006",
        "Authorization",
        "Payer UM",
        "2026-11-06 15:20",
        "2026-11-06 15:21",
        "Infusion authorization",
        "Pending clinical review; no final decision visible at November 9 07:45",
        "Conflict",
        "Potential access barrier before next-day visit",
        "Route to UM and oncology team"
      ],
      [
        "R056",
        "M-1006",
        "Pharmacy",
        "PBM fill feed",
        "2026-11-04 14:00",
        "2026-11-05 07:00",
        "Supportive medicine",
        "Antiemetic prescribed; fill record not yet visible in available feed",
        "Incomplete",
        "Could be provided through another channel; do not infer nonadherence",
        ""
      ],
      [
        "R057",
        "M-1006",
        "Contact",
        "Payer CRM",
        "2026-11-07 10:00",
        "2026-11-07 10:02",
        "Contact preference",
        "Phone calls 15:00-18:00 ET; patient permission recorded",
        "Verified",
        "",
        ""
      ],
      [
        "R058",
        "M-1006",
        "Outreach",
        "Case CRM",
        "2026-11-07 16:20",
        "2026-11-07 16:21",
        "Patient report",
        "Patient concerned about transport to infusion; no ride confirmed",
        "Verified",
        "",
        ""
      ],
      [
        "R059",
        "M-1006",
        "SDOH",
        "Care assessment",
        "2026-11-07 16:20",
        "2026-11-07 16:22",
        "Transportation",
        "Transport not arranged for November 10 visit",
        "Verified",
        "",
        ""
      ],
      [
        "R060",
        "M-1006",
        "CarePlan",
        "Case-management system",
        "2026-11-08 10:00",
        "2026-11-08 10:01",
        "Open task",
        "Time-sensitive: verify authorization and ride; coordinate with oncology team",
        "Verified",
        "",
        ""
      ]
    ],
    "alerts": [
      [
        "T001",
        "M-1001",
        "Post-discharge medication conflict",
        "ADT+discharge+old medication record",
        "Discharge torsemide 20 mg vs 10 mg prior",
        "Flag dose discrepancy with dates and sources",
        "Maria + prescribing team",
        "Never select dosage automatically",
        "P1"
      ],
      [
        "T002",
        "M-1001",
        "Possible post-discharge fill gap",
        "Discharge + PBM + appointment",
        "No post-discharge fill or connected follow-up recorded",
        "Suggest confirmation and care follow-up",
        "Maria + pharmacy/provider",
        "No nonadherence claim from missing fill",
        "P1"
      ],
      [
        "T003",
        "M-1002",
        "Missing hospital context",
        "Recent incomplete ED ADT",
        "Encounter without reason or discharge status",
        "Request latest encounter status / records",
        "Maria + HIE/hospital",
        "Do not assign diagnosis",
        "P1"
      ],
      [
        "T004",
        "M-1002",
        "Contact path failure",
        "Contact + outreach",
        "Disconnected number and repeated attempts",
        "Suppress unverified number; verify authorized channel",
        "Maria + member services",
        "Do not contact an unconsented third party",
        "P1"
      ],
      [
        "T005",
        "M-1003",
        "Diabetes follow-up concern",
        "Lab + missed visit + medication records",
        "HbA1c 10.2 and missed visit; no newer fill visible",
        "Flag for clinical review and outreach",
        "Maria + PCP",
        "No definitive medication stop claim",
        "P2"
      ],
      [
        "T006",
        "M-1003",
        "Data coverage / latency alert",
        "PBM + claim timing",
        "Pharmacy feed incomplete, claim 40 days delayed",
        "Show coverage and event versus receipt dates",
        "Workbench + Maria",
        "Do not equate delay with absence of care",
        "P2"
      ],
      [
        "T007",
        "M-1004",
        "Language mismatch",
        "CRM + patient preference + outreach",
        "CRM English vs patient verified Spanish; English outreach",
        "Prefer verified Spanish; flag conflicting CRM entry",
        "Maria + language services",
        "Follow privacy and authorized channel rules",
        "P2"
      ],
      [
        "T008",
        "M-1004",
        "Referral not closed",
        "Care plan + referral + appointment",
        "Referral placed, attendance unknown",
        "Keep referral open until verified",
        "Maria + behavioral care team",
        "Do not disclose protected notes or assume completion",
        "P2"
      ],
      [
        "T009",
        "M-1005",
        "Service delivery mismatch",
        "UM approval + agency status",
        "Home health authorized; agency has not confirmed start",
        "Escalate first visit confirmation",
        "Maria + home health agency",
        "Approved != delivered",
        "P1"
      ],
      [
        "T010",
        "M-1005",
        "Caregiver support gap",
        "Contact + SDOH + care plan",
        "Overwhelmed caregiver, permission noted",
        "Coordinate support and track follow-up",
        "Maria + authorized caregiver",
        "Verify consent and permissible contact",
        "P1"
      ],
      [
        "T011",
        "M-1006",
        "Oncology authorization risk",
        "Appointment + prior authorization",
        "Infusion scheduled tomorrow; authorization pending",
        "Escalate status verification urgently",
        "Maria + UM + oncology team",
        "Do not assume appointment is canceled",
        "P1"
      ],
      [
        "T012",
        "M-1006",
        "Cancer treatment access barrier",
        "SDOH + outreach + schedule",
        "Patient has no confirmed ride for treatment visit",
        "Arrange or confirm transportation assistance",
        "Maria + patient + transport partner",
        "Verify covered options and patient preferences",
        "P1"
      ]
    ],
    "defects": [
      [
        "Q01",
        "M-1001",
        "Conflicting medication dose",
        "Discharge and Medication",
        "Hospital 20 mg vs older outpatient 10 mg",
        "Unclear whether change is intentional",
        "Show both records; clinician reconciliation",
        "P1"
      ],
      [
        "Q02",
        "M-1001",
        "Missing post-discharge fill and appointment",
        "Pharmacy + Appointments",
        "No corresponding newer data visible",
        "Incomplete coverage, not proof of failure",
        "Use possible-gap language; verify",
        "P1"
      ],
      [
        "Q03",
        "M-1001",
        "Stale transport assessment",
        "SDOH",
        "Feb 2026 screen",
        "Barrier may have changed",
        "Reassess before arranging services",
        "P2"
      ],
      [
        "Q04",
        "M-1002",
        "Diagnosis-free ADT",
        "Hospital_ADT",
        "ED event lacks diagnosis/status",
        "Inadequate event details",
        "Seek discharge/encounter record",
        "P1"
      ],
      [
        "Q05",
        "M-1002",
        "Disconnected number",
        "Contact + Outreach",
        "Invalid number remains active in CRM",
        "Repeated unsuccessful calls",
        "Suppress / verify contact; check permissions",
        "P1"
      ],
      [
        "Q06",
        "M-1002",
        "Delayed claims",
        "Claims",
        "Recent ED encounter not posted",
        "Historical view omits real-time event",
        "Use ADT for recent events",
        "P2"
      ],
      [
        "Q07",
        "M-1003",
        "Incomplete PBM + lagged claim",
        "Pharmacy + Claims",
        "Later fills not visible; 40-day claim lag",
        "Absence of record is not absence of care",
        "Flag coverage; verify with patient",
        "P1"
      ],
      [
        "Q08",
        "M-1003",
        "Stale social-needs screen",
        "SDOH",
        "March 2026 food screen",
        "Current food access unknown",
        "Reassess",
        "P2"
      ],
      [
        "Q09",
        "M-1004",
        "Language contradiction",
        "Contact + Outreach",
        "Patient Spanish vs CRM English",
        "Outreach channel mismatch",
        "Show verified preference, seek confirmation",
        "P1"
      ],
      [
        "Q10",
        "M-1004",
        "Behavioral note restricted/referral unresolved",
        "Clinical + Referral",
        "Detailed note unavailable; visit status unknown",
        "Privacy and follow-through",
        "Permission-aware UI; keep referral pending",
        "P1"
      ],
      [
        "Q11",
        "M-1005",
        "Authorization vs delivery",
        "Authorization + HomeHealth",
        "Payer authorized; agency pending",
        "Service may not have started",
        "Track service initiation separately",
        "P1"
      ],
      [
        "Q12",
        "M-1006",
        "Appointment vs authorization",
        "Appointments + Authorization",
        "Scheduled infusion, approval pending",
        "Potential treatment access barrier",
        "Verify with UM + oncology",
        "P1"
      ],
      [
        "Q13",
        "M-1006",
        "Unknown oncology lab readiness",
        "Labs",
        "CBC seven days before visit",
        "Clinical readiness requirement unknown",
        "Ask oncology team; no automated clearance",
        "P2"
      ],
      [
        "Q14",
        "M-1006",
        "Missing transport",
        "SDOH + Outreach",
        "No confirmed ride",
        "Appointment access risk",
        "Coordinate permitted transport support",
        "P1"
      ]
    ],
    "coverage": [
      [
        "M-1001",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "7"
      ],
      [
        "M-1002",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "7"
      ],
      [
        "M-1003",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "7"
      ],
      [
        "M-1004",
        "1",
        "0",
        "1",
        "1",
        "1",
        "1",
        "1",
        "6"
      ],
      [
        "M-1005",
        "1",
        "0",
        "1",
        "1",
        "1",
        "1",
        "1",
        "6"
      ],
      [
        "M-1006",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "7"
      ]
    ],
    "catalog": [
      [
        "Member",
        "Payer enrollment",
        "Internal/authorized",
        "Daily / on change",
        "Eligibility changes, duplicate demographics",
        "Confirm identity and coverage",
        "MVP"
      ],
      [
        "Hospital_ADT",
        "Hospital / HIE",
        "Authorized event feed",
        "Minutes to hours, variable",
        "Missing reasons and late notifications",
        "Identify recent admissions/discharges",
        "MVP"
      ],
      [
        "Discharge",
        "Hospital EHR / HIE",
        "Authorized clinical exchange",
        "Hours to days, variable",
        "Delayed summaries, conflicting medications",
        "Plan timely follow-up",
        "MVP"
      ],
      [
        "Clinical",
        "EHR / HIE / specialists",
        "Authorized exchange",
        "After documentation / variable",
        "Historical diagnoses, sensitive access",
        "Understand conditions in context",
        "MVP"
      ],
      [
        "Labs",
        "EHR or lab result feed",
        "Authorized",
        "After result finalization",
        "Units, specimen, missing updates",
        "Review clinical findings",
        "MVP"
      ],
      [
        "Medication",
        "Prescriber / EHR",
        "Authorized",
        "On prescription update",
        "Old orders, discontinuations",
        "Reconcile intended regimen",
        "MVP"
      ],
      [
        "Pharmacy",
        "PBM / pharmacy claims",
        "Contracted / authorized",
        "Daily target, coverage variable",
        "Reversals, cash fills, incomplete network",
        "Detect possible fill/access gap",
        "MVP"
      ],
      [
        "Claims",
        "Payer adjudication",
        "Internal payer",
        "Weeks possible",
        "Care events posted after occurrence",
        "Understand longitudinal utilization",
        "MVP"
      ],
      [
        "Contact",
        "Payer CRM / member",
        "Internal; permitted member reporting",
        "After verified interactions",
        "Wrong phone, stale language",
        "Plan permitted effective outreach",
        "MVP"
      ],
      [
        "Outreach",
        "Case manager CRM",
        "Internal",
        "After interaction",
        "Uncoded outcomes, repeated entries",
        "Improve contact strategy",
        "MVP"
      ],
      [
        "SDOH",
        "Assessment / member self-report",
        "Authorized",
        "At screening / reassessment",
        "Stale / self-reported / sensitive",
        "Identify care access barriers",
        "MVP"
      ],
      [
        "CarePlan",
        "Case-management platform",
        "Internal",
        "Near-real-time target",
        "Stale tasks and unclear completion",
        "Prioritize, track and document care",
        "MVP"
      ],
      [
        "Appointments",
        "Provider scheduling",
        "Partner dependent",
        "Daily / event-driven",
        "No-show and external data gaps",
        "Find missed / unconfirmed follow-ups",
        "MVP"
      ],
      [
        "Authorization",
        "Payer UM",
        "Internal",
        "On status change",
        "Out-of-sync authorizations",
        "Resolve blocked services",
        "MVP"
      ],
      [
        "Referral",
        "Provider / community partners",
        "Partner dependent",
        "On updates",
        "Referral placed \u2260 completed",
        "Close care coordination loop",
        "Phase 2"
      ],
      [
        "HomeHealth",
        "Home care agencies",
        "Contract dependent",
        "Event / daily",
        "Delivery status lags approvals",
        "Confirm home service initiation",
        "Phase 2"
      ],
      [
        "CareTeam",
        "Payer and clinical directory",
        "Internal / contracted",
        "Periodic",
        "Outdated personnel and permissions",
        "Identify authorized care-team contacts",
        "MVP"
      ]
    ],
    "readme": [
      [
        "Purpose",
        "Reusable synthetic baseline for six patient scenarios; slide 5/6 content + product test fixture."
      ],
      [
        "Scenario time",
        "Monday, 2026-11-09, 08:00 Eastern (simulation snapshot; fixed, not live)."
      ],
      [
        "Privacy",
        "100% fabricated patients and identifiers. No real names, phone numbers beyond reserved fictional conventions, or PHI."
      ],
      [
        "Ground truth",
        "Every observed_value is a synthetic source assertion. Some records deliberately conflict, lag or omit fields."
      ],
      [
        "Access assumption",
        "Operational patient-level records require contracted / authorized access; no public real-person health data used."
      ],
      [
        "IDs",
        "One payer-assigned member ID per patient. Record IDs R001-R060 are unique across the workbook."
      ],
      [
        "Sources",
        "External source labels are fictitious. Public data resources are references only; individual records were generated for this demo."
      ],
      [
        "Time meaning",
        "Event time is when the event/fact was recorded. Received time is when the workbench would receive it."
      ],
      [
        "Uncertainty",
        "Missing claims, fills and appointments never prove a patient missed treatment or care."
      ],
      [
        "Decision support",
        "Insights are hypotheses; clinical decisions and verification remain with Maria and treating teams."
      ],
      [
        "Priority",
        "P1 = review today due to plausible time-critical needs; P2 = follow-up today; illustrative, not a validated algorithm."
      ],
      [
        "Data errors",
        "Conflict = differing sources; Incomplete = missing coverage or event detail; Delayed = late receipt; Stale = old assessment; Restricted = permission-gated."
      ],
      [
        "Sheets",
        "Cases = six personas; Records = 60 linked records; Expected Alerts = assertions; Data Defects = planted faults; Coverage = product tests; Data Catalog = source metadata."
      ],
      [
        "Research link \u2014 synthetic FHIR",
        "https://synthetichealth.github.io/synthea/"
      ],
      [
        "Research link \u2014 US Core",
        "https://hl7.org/fhir/us/core/"
      ],
      [
        "Research link \u2014 oncology transport",
        "https://www.cancer.gov/news-events/cancer-currents-blog/2024/cancer-disparities-transportation-food-housing"
      ],
      [
        "Research link \u2014 oncology authorization",
        "https://www.asco.org/about-asco/press-center/news-releases/prior-authorization-often-places-burden-patients-with-cancer-delays-care"
      ],
      [
        "Case basis",
        "HiLabs APM Case Management caselet, pages 1\u20133; sixth patient is user-requested extension beyond original 5-patient brief."
      ]
    ]
  };

  // server/case-plans.mjs
  var case_plans_default = {
    "M-1006": {
      "signal": "Tomorrow\u2019s infusion \xB7 access unresolved",
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
      "contact": "Phone preferred 15:00\u201318:00 ET. Permission is recorded. Coordinate with UM and oncology before the call window.",
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
      "signal": "Home health authorized \xB7 start unconfirmed",
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
      "signal": "Recent ED alert \xB7 disconnected phone",
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
      "signal": "Possible refill gap \xB7 missed follow-up",
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
      "signal": "Interpreter needed \xB7 referral unconfirmed",
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

  // server/csv.mjs
  var columns = [
    "record_id",
    "member_id",
    "dataset",
    "fictional_source",
    "event_at_et",
    "received_at_et",
    "field",
    "observed_value",
    "quality_flag",
    "limitation",
    "expected_handling"
  ];
  var fields = [
    "id",
    "member",
    "domain",
    "source",
    "event",
    "received",
    "title",
    "value",
    "quality",
    "limitation",
    "handling"
  ];
  function toRecord(values) {
    return Object.fromEntries(fields.map((field, index) => [field, values[index]]));
  }
  function validDateTime(value) {
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(value)) return false;
    const date = /* @__PURE__ */ new Date(value.replace(" ", "T") + ":00Z");
    return Number.isFinite(+date) && date.toISOString().slice(0, 16).replace("T", " ") === value;
  }
  function parseCsv(text2) {
    const rows = [];
    let row = [], field = "", quoted = false, closed = false;
    function finishField() {
      row.push(field);
      field = "";
      closed = false;
    }
    function finishRow() {
      finishField();
      if (row.some(Boolean) || row.length > 1) rows.push(row);
      row = [];
    }
    for (let i = 0; i < text2.length; i++) {
      const char = text2[i];
      if (quoted) {
        if (char === '"' && text2[i + 1] === '"') {
          field += '"';
          i++;
        } else if (char === '"') {
          quoted = false;
          closed = true;
        } else {
          field += char;
        }
      } else if (char === ",") {
        finishField();
      } else if (char === "\r" || char === "\n") {
        if (char === "\r" && text2[i + 1] === "\n") i++;
        finishRow();
      } else if (closed) {
        throw new Error("Unexpected text after a closing quote.");
      } else if (char === '"') {
        if (field) throw new Error("Unexpected quote inside an unquoted field.");
        quoted = true;
      } else {
        field += char;
      }
    }
    if (quoted) throw new Error("A quoted field was left open.");
    if (field || closed || row.length) finishRow();
    return rows;
  }
  function previewCsv(csv, state, memberIds, domains2) {
    const errors = [], accepted = [];
    let duplicates = 0;
    const result = () => ({ accepted, duplicates, errors });
    if (typeof csv !== "string" || !csv.trim() || csv.length > 25e4) {
      errors.push({ row: 1, reason: "Choose a non-empty CSV smaller than 250 KB." });
      return result();
    }
    let rows;
    try {
      rows = parseCsv(csv.replace(/^\uFEFF/, ""));
    } catch (error) {
      errors.push({ row: 1, reason: error.message });
      return result();
    }
    const [header, ...data] = rows;
    if (!header || header.length !== columns.length || columns.some((column, index) => header[index] !== column)) {
      errors.push({ row: 1, reason: "The CSV headers must match the standardized records export." });
      return result();
    }
    if (!data.length || data.length > 500) {
      errors.push({ row: 2, reason: "Include between 1 and 500 records per import." });
      return result();
    }
    const existing = new Map(state.records.map((record) => [record.id, record]));
    const qualities = ["Verified", "Conflict", "Delayed", "Incomplete", "Missing", "Provisional", "Restricted", "Stale"];
    for (const [index, row] of data.entries()) {
      const record = toRecord(row);
      let reason;
      if (row.length !== fields.length || row.slice(0, 9).some((value) => !value.trim()) || row.some((value) => value.length > 2e3)) {
        reason = "Check the column count, required values, and field lengths.";
      } else if (!/^[A-Z][A-Z0-9-]{1,31}$/.test(record.id) || record.id.startsWith("SIM-")) {
        reason = "Use a valid source record ID outside the reserved SIM- namespace.";
      } else if (!memberIds.has(record.member)) {
        reason = "Unknown member ID.";
      } else if (!domains2.has(record.domain) || !qualities.includes(record.quality)) {
        reason = "Unrecognized dataset or quality flag.";
      } else if (!validDateTime(record.event) || !validDateTime(record.received) || record.received < record.event) {
        reason = "Use valid ET timestamps (YYYY-MM-DD HH:mm). Receipt must follow the event.";
      } else if (existing.has(record.id)) {
        if (fields.every((field) => existing.get(record.id)[field] === record[field])) {
          duplicates++;
          continue;
        }
        reason = "This ID already has different content. Keep the original and use a new ID for a separate assertion.";
      }
      if (reason) {
        errors.push({ row: index + 2, id: record.id, reason });
      } else {
        existing.set(record.id, record);
        accepted.push(record);
      }
    }
    return result();
  }

  // server/verification.mjs
  var policies = {
    "M-1001-1": ["Prescribing team", "Intended regimen confirmed"],
    "M-1001-2": ["Member, pharmacy or clinic", "Medication access and follow-up confirmed"],
    "M-1002-1": ["Hospital or HIE", "ED encounter details received"],
    "M-1002-2": ["Member services or member", "Contact route and permission verified"],
    "M-1003-1": ["Member or pharmacy", "Medication access and barriers confirmed"],
    "M-1003-2": ["PCP or scheduling team", "Visit outcome confirmed"],
    "M-1004-1": ["Language services or member", "Interpreter support and contact outcome confirmed"],
    "M-1004-2": ["Behavioral-health team or member", "Referral outcome confirmed"],
    "M-1005-1": ["Home-health agency", "Start of care confirmed"],
    "M-1005-2": ["Authorized caregiver", "Support plan confirmed by caregiver"],
    "M-1006-1": ["Payer utilization management", "Payer determination confirmed"],
    "M-1006-2": ["Treating oncology team", "Next steps confirmed by treating team"],
    "M-1006-3": ["Transportation partner or member", "Ride or alternative confirmed"],
    "M-1006-4": ["Member", "Contact outcome documented"]
  };
  function outcomePolicy(task) {
    const [source, disposition] = policies[task.id] || ["Responsible party", "Required outcome confirmed"];
    return { source, disposition };
  }
  function findRecord(state, reference) {
    const id = reference.toUpperCase();
    return state.records.find((record) => record.id === (id === "UM-DEMO-1109" ? "SIM-UM-001" : id));
  }
  function connectedOutcome(state, task, reference, at = state.clock) {
    const record = findRecord(state, reference);
    if (!record || record.member !== task.member || record.received > at || record.quality !== "Verified") {
      return null;
    }
    if (task.id !== "M-1006-1" || record.id !== "SIM-UM-001" || record.domain !== "Authorization") {
      return null;
    }
    return {
      kind: "record",
      reference: record.id,
      source: record.source,
      time: record.received,
      disposition: outcomePolicy(task).disposition
    };
  }
  var validReference = (value) => /^[A-Za-z0-9][A-Za-z0-9._:/-]{1,119}$/.test(value);
  function attestedOutcome(state, task, values) {
    const { reference, source, time, disposition, confirmed } = values;
    const policy = outcomePolicy(task);
    if (!confirmed || !source || !validReference(reference) || !validDateTime(time) || time > state.clock || disposition !== policy.disposition || findRecord(state, reference)) {
      return null;
    }
    const baseline = task.source && findRecord(state, task.source);
    const pendingRide = task.id === "M-1006-3" && findRecord(state, "SIM-RIDE-001");
    if (baseline && time < baseline.received || pendingRide && time < pendingRide.received) {
      return null;
    }
    return { kind: "attestation", reference, source, sourceRole: policy.source, time, disposition };
  }
  function permissionPolicy(blocked, channel) {
    if (blocked) {
      return {
        sources: ["Member services", "Member"],
        scope: "Case-management outreach through the alternate channel",
        label: "I verified permission to use this alternate channel for case-management outreach"
      };
    }
    if (channel === "Authorized caregiver") {
      return {
        sources: ["Member consent record", "Member"],
        scope: "Discuss home-health coordination and caregiver support",
        label: "I verified the caregiver\u2019s identity and consent for this scope"
      };
    }
    return null;
  }
  function scopedPermission(blocked, note) {
    const policy = permissionPolicy(blocked, note.channel);
    if (!policy || note.permissionConfirmed !== true || !policy.sources.includes(note.permissionSource) || note.permissionScope !== policy.scope || !validReference(note.permissionReference)) return null;
    return { source: note.permissionSource, scope: note.permissionScope, reference: note.permissionReference };
  }

  // server/workbench.mjs
  var START = "2026-11-09 08:00";
  var ACTOR = "Maria Chen, RN";
  var cases = seed_default.cases.map(([id, name, age, scenario, priority]) => ({ id, name, age, scenario, priority: priority.slice(0, 2) }));
  var members = new Set(cases.map((member) => member.id));
  var domains = new Set(seed_default.catalog.map((row) => row[0]));
  var actionDomains = /* @__PURE__ */ new Set([
    "Hospital_ADT",
    "Discharge",
    "Medication",
    "Authorization",
    "Appointments",
    "HomeHealth",
    "Referral",
    "Contact",
    "Pharmacy"
  ]);
  var steps = [
    {
      id: "payer-update",
      member: "M-1006",
      domain: "Authorization",
      source: "Payer utilization management \xB7 simulation",
      event: "2026-11-09 08:04",
      received: "2026-11-09 08:05",
      title: "Infusion authorization determination",
      value: "Simulated payer approval for the scheduled infusion. Reference UM-DEMO-1109.",
      quality: "Verified",
      limitation: "Payer approval addresses coverage only.",
      handling: "Verify the authorization task. Keep transportation and treating-team follow-up open.",
      recordId: "SIM-UM-001"
    },
    {
      id: "transport-update",
      member: "M-1006",
      domain: "SDOH",
      source: "Transportation partner \xB7 simulation",
      event: "2026-11-09 08:08",
      received: "2026-11-09 08:09",
      title: "Transportation status update",
      value: "Ride request received. Pickup confirmation is still pending.",
      quality: "Incomplete",
      limitation: "No confirmed pickup time.",
      handling: "Keep the transportation task open and verify the ride or an alternative.",
      recordId: "SIM-RIDE-001"
    }
  ];
  function initialState() {
    return {
      clock: START,
      records: seed_default.records.map(toRecord),
      drafts: {},
      reviewed: [],
      notes: [],
      activity: [],
      imports: [],
      requestIds: [],
      tasks: cases.flatMap(({ id }) => case_plans_default[id].tasks.map(([title, owner, source, outcome], index) => ({
        id: id + "-" + (index + 1),
        member: id,
        title,
        owner,
        source,
        outcome,
        due: START.slice(0, 10) + " " + (index === 0 ? case_plans_default[id].deadline : "17:00"),
        status: "Open"
      })))
    };
  }
  function visibleRecords(state) {
    return state.records.filter((record) => record.received <= state.clock);
  }
  function safeRecord(record) {
    if (record.quality !== "Restricted") return record;
    return {
      id: record.id,
      member: record.member,
      domain: record.domain,
      title: "Restricted source record",
      quality: record.quality,
      source: "Restricted partner",
      event: record.event,
      received: record.received,
      value: "Your demo role can see that a record exists. Details are restricted."
    };
  }
  function newUpdates(state, records = visibleRecords(state)) {
    const original = new Set(seed_default.records.map((row) => row[0]));
    const reviewed = new Set(state.reviewed);
    return records.filter((record) => !original.has(record.id) && !reviewed.has(record.id) && (actionDomains.has(record.domain) || ["Conflict", "Missing"].includes(record.quality) || steps.some((step) => step.recordId === record.id))).map(safeRecord);
  }
  function recordSort(left, right) {
    return right.event.localeCompare(left.event) || left.id.localeCompare(right.id);
  }
  function reviewPriorClosure(state, task) {
    if (task.status !== "Verified" || task.verification) return task;
    const { evidence, confirmation, verifiedAt, ...open } = task;
    const verification = verifiedAt && connectedOutcome(state, task, evidence || "", verifiedAt);
    if (verification) {
      return { ...task, evidence: verification.reference, confirmation: verification.disposition, verification };
    }
    return { ...open, status: "Needs verification", priorClosure: { evidence, confirmation, verifiedAt } };
  }
  function permissionNeedsReview(note) {
    return note.type === "Outreach" && !note.permission && (case_plans_default[note.member]?.blocked || note.channel === "Authorized caregiver");
  }
  function caseSummary(member, records, tasks, updates) {
    const plan = case_plans_default[member.id];
    const ids = new Set(records.map((record) => record.id));
    const openTasks = tasks.filter((task) => task.status !== "Verified").sort((left, right) => left.due.localeCompare(right.due) || left.id.localeCompare(right.id));
    const nextTask = openTasks[0];
    const evidence = plan.evidence.filter((id) => ids.has(id));
    const payerUpdate = ids.has("SIM-UM-001");
    const transportUpdate = ids.has("SIM-RIDE-001");
    let { signal, why, next, trust } = plan;
    let authorization = "Pending review";
    if (member.id === "M-1006" && payerUpdate) {
      signal = "Payer update received \xB7 follow-up needed";
      why = "The scheduled infusion remains on the calendar. A simulated payer approval arrived. Transportation and treating-team follow-up are tracked separately.";
      next = "Review the payer determination and verify the authorization task. Confirm the ride and next steps with oncology.";
      trust = "New payer determination";
      authorization = "Approved by payer \xB7 simulated";
      evidence.unshift("SIM-UM-001");
    }
    if (member.id === "M-1006" && transportUpdate) evidence.unshift("SIM-RIDE-001");
    if (member.id === "M-1006" && payerUpdate && tasks.find((task) => task.id === "M-1006-1")?.status === "Verified") {
      signal = "Authorization verified \xB7 coordination open";
      next = nextTask ? nextTask.title + "." : "Review the verified outcomes.";
    }
    if (member.id !== "M-1006" && tasks.find((task) => task.id === member.id + "-1")?.status === "Verified" && nextTask) {
      signal = "Initial outcome verified \xB7 follow-up open";
      next = nextTask.title + ".";
    }
    if (!openTasks.length) {
      signal = "Tracked actions verified";
      next = "Review the verified outcomes and any new evidence.";
    }
    const additional = updates.filter((update) => !evidence.includes(update.id));
    if (additional.length) {
      signal = "New source evidence \xB7 review needed";
      next = "Review the new source evidence and confirm whether it changes the next action.";
      evidence.unshift(...additional.map((update) => update.id));
    }
    const priority = nextTask || updates.length ? member.priority : "Complete";
    return {
      ...member,
      priority,
      signal,
      why,
      next,
      trust,
      evidence,
      nextTask,
      authorization,
      deadline: nextTask?.due || null,
      openCount: openTasks.length,
      contact: plan.contact,
      blocked: !!plan.blocked,
      interpreter: !!plan.interpreter,
      caregiver: !!plan.caregiver,
      contactPermission: plan.blocked ? permissionPolicy(true) : plan.caregiver ? permissionPolicy(false, "Authorized caregiver") : null,
      updateCount: updates.length
    };
  }
  function publicState(state, revision) {
    const records = visibleRecords(state).map(safeRecord).sort(recordSort);
    const updates = newUpdates(state);
    const tasks = state.tasks.map((task) => ({ ...reviewPriorClosure(state, task), outcomePolicy: outcomePolicy(task) }));
    const roster = cases.map((member) => caseSummary(
      member,
      records.filter((record) => record.member === member.id),
      tasks.filter((task) => task.member === member.id),
      updates.filter((update) => update.member === member.id)
    ));
    const notes = state.notes.map((note) => ({ ...note, permissionReview: !!permissionNeedsReview(note) }));
    const outreach = notes.filter((note) => note.type === "Outreach" && !note.permissionReview);
    return {
      revision,
      clock: state.clock,
      actor: ACTOR,
      cases: roster,
      records,
      updates,
      tasks,
      drafts: state.drafts,
      notes,
      activity: state.activity,
      imports: state.imports,
      catalog: seed_default.catalog,
      replay: steps.map((step) => ({
        id: step.id,
        title: step.title,
        received: step.received,
        available: !state.records.some((record) => record.id === step.recordId) && (step.id !== "transport-update" || state.records.some((record) => record.id === "SIM-UM-001")),
        played: state.records.some((record) => record.id === step.recordId)
      })),
      metrics: {
        open: tasks.filter((task) => task.status !== "Verified").length,
        overdue: tasks.filter((task) => task.status !== "Verified" && task.due < state.clock).length,
        verified: tasks.filter((task) => task.status === "Verified").length,
        attempts: outreach.length,
        connected: outreach.filter((note) => note.outcome === "Connected").length,
        signed: state.notes.length
      }
    };
  }
  function checkImport(state, csv) {
    const { accepted, duplicates, errors } = previewCsv(csv, state, members, domains);
    return { accepted: accepted.length, duplicates, errors };
  }
  var WorkflowError = class extends Error {
    constructor(message, status = 400) {
      super(message);
      this.status = status;
    }
  };
  function requireValue(test, message, status) {
    if (!test) throw new WorkflowError(message, status);
  }
  function text(value, max = 3e3) {
    requireValue(typeof value === "string" && value.trim().length <= max, "Check the text length and try again.");
    return value.trim();
  }
  function log(state, member, label, detail) {
    state.activity.unshift({ id: crypto.randomUUID(), member, label, detail, at: state.clock, actor: ACTOR });
  }
  var noteTypes = ["Pre-contact briefing", "Outreach", "Route investigation", "Care coordination"];
  var noteOutcomes = ["Connected", "Voicemail", "No answer", "Disconnected"];
  function noteValues(body) {
    requireValue(noteTypes.includes(body.type), "Choose an activity type.");
    return {
      type: body.type,
      channel: text(body.channel || "", 100),
      route: text(body.route || "", 300),
      outcome: text(body.outcome || "", 100),
      text: text(body.text || ""),
      followUp: text(body.followUp || "", 300),
      interpreter: body.interpreter === true,
      generated: text(body.generated || ""),
      permissionSource: text(body.permissionSource || "", 100),
      permissionScope: text(body.permissionScope || "", 160),
      permissionReference: text(body.permissionReference || "", 120),
      permissionConfirmed: body.permissionConfirmed === true
    };
  }
  function newTask(state, member, input) {
    const task = {
      id: crypto.randomUUID(),
      member,
      title: text(input.title || "", 140),
      owner: text(input.owner || "", 140),
      due: text(input.due || "", 30),
      outcome: text(input.outcome || "", 300),
      source: input.source || null,
      status: "Open"
    };
    requireValue(
      task.title && task.owner && task.outcome && validDateTime(task.due),
      "Enter a task title, owner, due date, and verification requirement."
    );
    state.tasks.push(task);
    log(state, member, "Task created", task.title + " \xB7 " + task.owner);
  }
  function verifyTask(state, task, body) {
    const evidence = text(body.evidence || "", 140);
    let verification;
    if (body.verificationMode === "attestation") {
      verification = attestedOutcome(state, task, {
        reference: evidence,
        source: text(body.outcomeSource || "", 140),
        time: text(body.outcomeTime || "", 30),
        disposition: body.disposition,
        confirmed: body.outcomeConfirmed === true
      });
      requireValue(
        verification,
        "Record a qualifying external outcome with its source, time, unique reference, and clinician attestation."
      );
    } else {
      verification = connectedOutcome(state, task, evidence);
      requireValue(verification, "Use a visible source record that confirms this task\u2019s outcome for this member.");
    }
    const { reference, source, time, disposition, kind } = verification;
    Object.assign(task, {
      status: "Verified",
      evidence: reference,
      confirmation: disposition,
      verifiedAt: state.clock,
      verification
    });
    log(
      state,
      task.member,
      kind === "attestation" ? "Outcome attested by clinician" : "Outcome verified",
      [task.title, reference, source, time + " ET", disposition].join(" \xB7 ")
    );
  }
  function applyAction(state, body) {
    const { action, member } = body;
    if (action === "reset") return { state: initialState(), message: "Monday baseline restored." };
    state.tasks = state.tasks.map((task2) => reviewPriorClosure(state, task2));
    if (action === "import") {
      const preview = previewCsv(body.csv, state, members, domains);
      requireValue(!preview.errors.length, "Correct the rejected CSV rows before importing.");
      if (!preview.accepted.length) return { state, changed: false, message: "All rows were already present." };
      state.records.push(...preview.accepted);
      const name = text(body.filename || "Records CSV", 120);
      state.imports.unshift({ name, at: state.clock, added: preview.accepted.length, duplicates: preview.duplicates });
      log(state, null, "CSV imported", name + " \xB7 " + preview.accepted.length + " records");
      return { state, message: preview.accepted.length + " source records imported." };
    }
    if (action === "advance") {
      requireValue(validDateTime(body.clock) && body.clock >= state.clock, "Choose a valid time at or after the current snapshot.");
      if (body.clock === state.clock) return { state, changed: false, message: "Snapshot unchanged." };
      state.clock = body.clock;
      log(state, null, "Simulation advanced", state.clock + " ET");
      return { state, message: "Simulation time updated." };
    }
    if (action === "replay") {
      const step = steps.find((item) => item.id === body.id);
      requireValue(step, "Unknown replay event.");
      if (state.records.some((record2) => record2.id === step.recordId)) {
        return { state, changed: false, message: "This event is already present." };
      }
      requireValue(
        step.id !== "transport-update" || state.records.some((record2) => record2.id === "SIM-UM-001"),
        "Replay the payer update first."
      );
      const { id, recordId, ...record } = step;
      state.records.push({ ...record, id: recordId });
      if (state.clock < step.received) state.clock = step.received;
      log(state, step.member, "Source update received", recordId + " \xB7 " + step.title);
      return { state, message: "Synthetic update received for Nina Shah." };
    }
    requireValue(members.has(member), "Choose a valid member.", 404);
    if (action === "review") {
      requireValue(
        Array.isArray(body.ids) && body.ids.every((id) => typeof id === "string"),
        "Select the displayed updates."
      );
      const shown = new Set(body.ids);
      const ids = newUpdates(state).filter((record) => record.member === member && shown.has(record.id)).map((record) => record.id);
      if (!ids.length) return { state, changed: false, message: "These updates were already reviewed." };
      state.reviewed.push(...ids);
      log(state, member, "Evidence reviewed", ids.join(", "));
      return { state, message: ids.length + (ids.length === 1 ? " update marked reviewed." : " updates marked reviewed.") };
    }
    if (action === "draft" || action === "sign") {
      const note = noteValues(body);
      if (action === "draft") {
        state.drafts[member] = note;
        return { state, message: "Draft saved." };
      }
      requireValue(body.reviewed === true && note.text, "Enter a note and confirm clinician review.");
      requireValue(
        !newUpdates(state).some((record) => record.member === member),
        "Review the new evidence before signing. Your draft can still be saved.",
        409
      );
      if (note.type === "Outreach") {
        const plan = case_plans_default[member];
        const channels = plan.blocked ? ["Verified alternative"] : ["Phone", "Verified alternative", "Approved portal", ...plan.caregiver ? ["Authorized caregiver"] : []];
        requireValue(
          channels.includes(note.channel) && noteOutcomes.includes(note.outcome),
          "Choose a permitted contact channel and an observed outcome."
        );
        if (permissionPolicy(plan.blocked, note.channel)) {
          note.permission = scopedPermission(plan.blocked, note);
          requireValue(note.permission, plan.blocked ? "Record a verified, permitted alternative route with scoped permission before signing." : "Verify caregiver identity and consent for the selected scope before signing.");
          requireValue(
            !state.records.some((record) => record.id.toUpperCase() === note.permission.reference.toUpperCase()),
            "Enter the external permission reference. The connected case records do not establish this scope."
          );
          note.route = "";
        } else {
          requireValue(note.route, "Enter the verified contact route.");
        }
        requireValue(
          !plan.interpreter || note.outcome !== "Connected" || note.interpreter,
          "Record interpreter support for the connected encounter."
        );
        requireValue(!note.generated || note.text !== note.generated, "Enter your observed interaction details.");
      } else {
        Object.assign(note, {
          channel: "",
          route: "",
          outcome: "",
          interpreter: false,
          permissionSource: "",
          permissionScope: "",
          permissionReference: "",
          permissionConfirmed: false
        });
      }
      if (note.followUp) newTask(state, member, {
        title: note.followUp,
        owner: ACTOR,
        due: state.clock.slice(0, 10) + " 17:00",
        outcome: "Document the follow-up and the verified result."
      });
      state.notes.unshift({ ...note, id: crypto.randomUUID(), member, at: state.clock, actor: ACTOR });
      delete state.drafts[member];
      log(state, member, "Note signed", note.type + (note.outcome ? " \xB7 " + note.outcome : ""));
      return { state, message: "Signed note recorded." };
    }
    if (action === "task-create") {
      newTask(state, member, body);
      return { state, message: "Task created." };
    }
    if (action === "reconcile") {
      const record = visibleRecords(state).find((item) => item.member === member && item.id === body.id);
      requireValue(record && record.quality !== "Restricted", "Source record unavailable.", 404);
      const detail = text(body.detail || "", 600);
      requireValue(detail, "Enter the verification or reconciliation detail.");
      if (body.createTask === true) newTask(state, member, {
        title: "Verify source " + record.id,
        owner: ACTOR,
        due: state.clock.slice(0, 10) + " 17:00",
        outcome: detail.slice(0, 300),
        source: record.id
      });
      log(state, member, "Reconciliation recorded", record.id + " \xB7 " + detail);
      return { state, message: "Reconciliation saved. Source record preserved." };
    }
    requireValue(["task-start", "task-handoff", "task-verify"].includes(action), "Unknown action.", 404);
    const task = state.tasks.find((item) => item.id === body.id && item.member === member);
    requireValue(task && task.status !== "Verified", "This open task is unavailable.", 409);
    if (action === "task-verify") {
      verifyTask(state, task, body);
    } else if (action === "task-handoff") {
      const owner = text(body.owner || "", 140);
      const due = text(body.due || "", 30);
      const detail = text(body.detail || "", 600);
      requireValue(owner && validDateTime(due) && detail, "Enter the owner, due date, and handoff reason.");
      Object.assign(task, { owner, due, status: body.escalate ? "Escalated" : "Handed off" });
      log(state, member, task.status, task.title + " \xB7 " + owner + " \xB7 " + detail);
    } else {
      requireValue(task.status !== "In progress", "This task is already in progress.", 409);
      task.status = "In progress";
      log(state, member, "Task started", task.title);
    }
    return { state, message: "Task updated." };
  }

  // server/api.mjs
  var baseHeaders = {
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "content-security-policy": "default-src 'self'; base-uri 'none'; form-action 'self'; object-src 'none'"
  };
  function json(body, status = 200) {
    return Response.json(body, { status, headers: baseHeaders });
  }
  function createApp(store, assets) {
    return async function handle(request) {
      const url = new URL(request.url);
      if (request.method === "GET" && Object.hasOwn(assets, url.pathname)) {
        const [type, content] = assets[url.pathname];
        return new Response(content, { headers: { ...baseHeaders, "content-type": type } });
      }
      if (!["/api/state", "/api/import/preview", "/api/action"].includes(url.pathname)) {
        return json({ error: "Page or resource unavailable." }, 404);
      }
      let current;
      try {
        current = await store.read();
        if (request.method === "GET" && url.pathname === "/api/state") {
          return json(publicState(current.state, current.revision));
        }
        if (request.method !== "POST" || url.pathname === "/api/state") {
          return json({ error: "Method unavailable." }, 405);
        }
        const origin = request.headers.get("origin");
        if (origin && origin !== url.origin || request.headers.get("sec-fetch-site") === "cross-site" || !request.headers.get("content-type")?.startsWith("application/json")) {
          return json({ error: "Use the workbench to submit this action." }, 403);
        }
        const raw = await request.text();
        if (raw.length > 1e6) return json({ error: "Request is too large." }, 413);
        let body;
        try {
          body = JSON.parse(raw);
        } catch {
          return json({ error: "Invalid request data." }, 400);
        }
        if (!body || typeof body !== "object" || Array.isArray(body)) {
          return json({ error: "Invalid request data." }, 400);
        }
        if (url.pathname === "/api/import/preview") return json(checkImport(current.state, body.csv));
        const requestId = body.requestId;
        if (typeof requestId !== "string" || !/^[\da-f-]{36}$/i.test(requestId)) {
          return json({ error: "Missing action identifier." }, 400);
        }
        for (let attempt = 0; attempt < 3; attempt++) {
          const { state, revision } = current;
          if (state.requestIds.includes(requestId)) {
            return json({ state: publicState(state, revision), message: "Action already recorded." });
          }
          if (body.action !== "review" && body.revision !== revision) {
            return json({
              error: "The case changed while you were working. Review the latest evidence and retry.",
              state: publicState(state, revision)
            }, 409);
          }
          const result = applyAction(structuredClone(state), body);
          if (result.changed === false) {
            return json({ state: publicState(state, revision), message: result.message });
          }
          result.state.requestIds = [...result.state.requestIds.slice(-499), requestId];
          if (await store.write(revision, result.state)) {
            return json({ state: publicState(result.state, revision + 1), message: result.message });
          }
          current = await store.read();
        }
        return json({
          error: "The workspace is busy. Review the latest state and retry.",
          state: publicState(current.state, current.revision)
        }, 409);
      } catch (error) {
        if (error instanceof WorkflowError) {
          return json({ error: error.message, ...error.status === 409 && current ? { state: publicState(current.state, current.revision) } : {} }, error.status);
        }
        console.error(error);
        return json({ error: "The workbench could not save this request. Try again." }, 500);
      }
    };
  }
  function encodeInitialState() {
    return JSON.stringify(initialState());
  }

  // src/browser-api.mjs
  function createBrowserApi({ storage = localStorage, locks = navigator.locks, key = "hilabs-pages-demo-v1:" + new URL(".", location.href).pathname } = {}) {
    const read = () => {
      const raw = storage.getItem(key);
      if (raw) return JSON.parse(raw);
      return { revision: 0, state: JSON.parse(encodeInitialState()) };
    };
    const app = createApp({
      read,
      write(revision, state) {
        if (read().revision !== revision) return false;
        storage.setItem(key, JSON.stringify({ revision: revision + 1, state }));
        return true;
      }
    }, {});
    const handle = (path, options = {}) => app(new Request("https://hilabs-demo.invalid" + path, options));
    return (path, options) => locks ? locks.request(key, () => handle(path, options)) : handle(path, options);
  }

  // <stdin>
  window.hilabsFetch = createBrowserApi();
  (() => {
    const $ = (query) => document.querySelector(query);
    const main = $("main"), modal = $("#modal");
    const names = {
      queue: "Work Queue",
      coord: "Care Coordination",
      integrity: "Data Integrity",
      outcomes: "Outcomes",
      member: "Member 360",
      outreach: "Outreach & Documentation"
    };
    const icons = {
      queue: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
      coord: '<path d="M5 4h4v4H5zM15 10h4v4h-4zM5 16h4v4H5zM9 6h3v12H9m3-6h3"/>',
      integrity: '<path d="M4 7h16M4 12h16M4 17h16"/>',
      outcomes: '<path d="M4 19h16M7 16v-4m5 4V8m5 8V5"/>'
    };
    const categories = {
      overview: ["Overview"],
      timeline: ["Timeline"],
      medications: ["Medications", "Medication", "Pharmacy", "Discharge"],
      claims: ["Claims", "Claims"],
      appointments: ["Appointments", "Appointments", "Authorization", "Referral", "HomeHealth"],
      social: ["Social needs", "SDOH", "Contact", "CareTeam"],
      plans: ["Care plans", "CarePlan"]
    };
    let data, revision, view = "queue", selected = "M-1006", scope = "", category = "overview";
    let search = "", filter = "today", sort = "priority", queueScroll = 0, active = false;
    let importFile, preview, returnFocus, toastTimer;
    const unsaved = /* @__PURE__ */ new Map();
    const e = (value) => String(value ?? "").replace(
      /[&<>"']/g,
      (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
    );
    const badge = (label, type = label) => `<span class="badge ${e(type)}">${e(label)}</span>`;
    const btn = (label, action, id = "", style = "", disabled = false) => `<button class="button ${style}" type="button" data-do="${action}" data-id="${e(id)}" ${disabled ? "disabled" : ""}>${e(label)}</button>`;
    const panel = (title, body, style = "") => `<section class="panel ${style}"><div class="panel-header"><h2>${e(title)}</h2></div>${body}</section>`;
    const empty = (label) => `<p class="empty">${e(label)}</p>`;
    const detail = (value) => value ? e(value) + " ET" : "\u2014";
    const clock = (value) => value ? detail(value.slice(11)) : "\u2014";
    const options = (values, current) => values.map((value) => `<option ${value === current ? "selected" : ""}>${e(value)}</option>`).join("");
    const member = () => data.cases.find((item) => item.id === selected);
    const records = (id) => data.records.filter((item) => item.member === id);
    const updates = (id) => data.updates.filter((item) => item.member === id);
    const refs = (ids) => ids.length ? `<div class="sources" aria-label="Source records">${ids.map(
      (id) => `<button type="button" data-do="source" data-id="${e(id)}" aria-label="Open source ${e(id)}">${e(id)}</button>`
    ).join("")}</div>` : "";
    const head = (section, title, description) => `<div class="heading"><div><div class="eyebrow">${section}</div>
    <h1>${title}</h1><p>${description}</p></div><div class="date"><strong>${e(data.clock.slice(0, 10))}</strong>
    ${clock(data.clock)} \xB7 Simulation clock</div></div>`;
    function caseHeader(m) {
      return `<section class="member-head"><span class="initials" aria-hidden="true">${e(m.name.split(" ").map((n) => n[0]).join(""))}</span>
      <div><h2>${e(m.name)}</h2><p class="sub">${e(m.id)} \xB7 ${e(m.age)} years \xB7 ${e(m.scenario)}</p>
      <p class="tiny">${e(m.contact)}</p></div>${badge(m.priority)}
      <div class="actions">${btn("Back to queue", "queue")}
      ${view !== "member" ? btn("Member 360", "member", m.id) : ""}
      ${view !== "outreach" ? btn("Outreach & notes", "outreach", m.id) : ""}
      ${view !== "coord" ? btn("Case tasks", "coord", m.id) : ""}</div></section>`;
    }
    function record(r) {
      return `<article class="record"><div class="row-flex"><h3>${e(r.title)}</h3>${badge(r.quality)}</div>
      <p class="sub pre">${e(r.value)}</p><div class="tiny">${e(r.id)} \xB7 ${e(r.source)} \xB7 ${e(r.domain.replaceAll("_", " "))}</div>
      <div class="tiny">Event ${detail(r.event)} \xB7 Received ${detail(r.received)}</div>
      ${r.limitation ? `<p class="tiny">${e(r.limitation)}</p>` : ""}</article>`;
    }
    function newEvidence(m) {
      const list = updates(m.id);
      return list.length ? panel(
        "New since review",
        list.map((r) => `<article class="record"><h3>${e(r.title)}</h3>
      <p class="sub">${e(r.handling || "Review the new evidence and the related action.")}</p>
      <p class="tiny">Received ${detail(r.received)}</p>${refs([r.id])}</article>`).join("") + `<div class="pad">${btn("Mark displayed updates reviewed", "review", list.map((r) => r.id).join(","))}</div>`,
        "update-panel top-space"
      ) : "";
    }
    function summary(m) {
      return `<aside class="panel summary"><div class="summary-top"><div class="eyebrow">CASE EVIDENCE</div>
      ${badge(m.priority)}<h2>${e(m.name)}</h2><p class="sub">${e(m.scenario)}</p></div>
      <div class="pad"><h3>Why this case is here</h3><p class="sub">${e(m.why)}</p>${refs(m.evidence)}
      <h3 class="top-space">Suggested next step</h3><p class="reason">${e(m.next)}</p>
      <p class="sub"><b>Owner</b> \xB7 ${e(m.nextTask?.owner || "Case team")}</p>
      <p class="sub"><b>Evidence status</b> \xB7 ${e(m.trust)}</p>
      <p class="sub"><b>Open actions</b> \xB7 ${m.openCount}</p>
      <div class="actions">${view === "queue" ? btn("Open Member 360", "member", m.id, "primary") : btn("Outreach & notes", "outreach", m.id, "primary")}
        ${btn("Case tasks", "coord", m.id)}</div></div>
      <div class="caption">Suggestions require clinician review.</div></aside>${newEvidence(m)}`;
    }
    function queue() {
      const counts = data.cases.reduce((result, m) => {
        result[m.priority] = (result[m.priority] || 0) + 1;
        return result;
      }, {});
      return head("MY CASELOAD", "Priority work queue", "Review the cases that need action and see the evidence behind their position.") + `<section class="queue-strip" aria-label="Caseload overview">
      <div><b>${data.cases.length}</b><span>Assigned demo cases</span></div>
      <div><b>${counts.P1 || 0}</b><span>Review today</span></div>
      <div><b>${counts.P2 || 0}</b><span>Follow up today</span></div>
      <div><b>${data.cases.filter((m) => m.updateCount).length}</b><span>Cases with new evidence</span></div></section>
      <div class="grid queue-grid"><section class="panel"><div class="panel-header"><div><h2>Assigned cases</h2>
      <p class="tiny">Monday review \xB7 ${e(data.actor)}</p></div>${btn("View case preview", "preview", "", "mobile-preview")}</div>
      <div class="filters"><input id="search" aria-label="Search cases" placeholder="Search name, member ID, or issue" value="${e(search)}">
      <select id="filter" aria-label="Filter cases">${[
        ["today", "Due today"],
        ["active", "All active"],
        ["new", "New since review"],
        ["P1", "P1 \xB7 Review today"],
        ["P2", "P2 \xB7 Follow up today"],
        ["all", "All cases"]
      ].map(([id, label]) => `<option value="${id}" ${filter === id ? "selected" : ""}>${label}</option>`).join("")}</select>
      <select id="sort" aria-label="Sort cases">${[["priority", "Priority first"], ["due", "Due time first"], ["name", "Member name"]].map(([id, label]) => `<option value="${id}" ${sort === id ? "selected" : ""}>${label}</option>`).join("")}</select></div>
      <div class="table-wrap"><table aria-label="Prioritized cases"><thead><tr><th>Priority</th><th>Member</th><th>Why now</th>
      <th>Next due</th></tr></thead><tbody id="queue-rows"></tbody></table></div><div id="queue-count" class="caption" aria-live="polite"></div></section>
      <div id="preview" class="desktop-preview" aria-live="polite"></div></div>`;
    }
    function drawRows() {
      const query = search.trim().toLowerCase();
      const today = data.clock.slice(0, 10);
      const activeCase = (m) => m.priority !== "Complete";
      const filters = {
        today: (m) => activeCase(m) && (m.deadline?.slice(0, 10) <= today || m.updateCount),
        active: activeCase,
        new: (m) => m.updateCount,
        all: () => true,
        P1: (m) => m.priority === "P1",
        P2: (m) => m.priority === "P2"
      };
      const due = (a, b) => (a.deadline || "~").localeCompare(b.deadline || "~");
      const priority = (a, b) => Number(a.priority === "Complete") - Number(b.priority === "Complete") || a.priority.localeCompare(b.priority);
      const list = data.cases.filter((m) => filters[filter](m) && [m.name, m.id, m.signal, m.scenario].join(" ").toLowerCase().includes(query)).sort((a, b) => (sort === "due" ? due(a, b) || priority(a, b) : sort === "name" ? a.name.localeCompare(b.name) : priority(a, b) || due(a, b)) || a.id.localeCompare(b.id));
      const selection = list.find((m) => m.id === selected);
      if (!selection) selected = "";
      $("#preview").innerHTML = selection ? summary(selection) : panel("Case evidence", empty("Select a visible case to review its evidence."));
      $('[data-do="preview"]').disabled = !selection;
      $("#queue-rows").innerHTML = list.length ? list.map((m) => `<tr class="${m.id === selected ? "selected" : ""}">
      <td>${badge(m.priority, m.priority === "Complete" ? "Verified" : m.priority)}</td>
      <td><button type="button" class="link-button" data-do="select" data-id="${e(m.id)}" aria-pressed="${m.id === selected}">${e(m.name)}</button><small>${e(m.id)}</small></td>
      <td><b>${e(m.signal)}</b>${m.updateCount ? `<small class="new-label">${m.updateCount} new \xB7 Review pending</small>` : ""}</td>
      <td class="due-cell"><b>${clock(m.deadline)}</b><small>${m.openCount} open</small></td></tr>`).join("") : '<tr><td colspan="4" class="empty">No cases match these filters.</td></tr>';
      const hidden = data.cases.length - list.length;
      $("#queue-count").textContent = list.length + " of " + data.cases.length + " demo cases" + (hidden ? " \xB7 " + hidden + " hidden by filters" : "");
    }
    function audit(id) {
      const list = data.activity.filter((item) => !id || item.member === id);
      return list.length ? `<ul class="audit-list">${list.map((item) => `<li><div><h3>${e(item.label)}</h3>
      <p class="tiny">${detail(item.at)} \xB7 ${e(item.actor)}${item.member ? " \xB7 " + e(item.member) : ""}</p>
      <p class="sub pre">${e(item.detail)}</p></div></li>`).join("")}</ul>` : empty("No actions recorded yet.");
    }
    function memberPage(m) {
      const list = records(m.id).filter((r) => category === "timeline" || (category === "overview" ? m.evidence.includes(r.id) : categories[category].slice(1).includes(r.domain)));
      const tabs = `<div class="tabs" aria-label="Record categories">${Object.entries(categories).map(([id, [label]]) => `<button type="button" data-do="category" data-id="${id}" aria-pressed="${category === id}">${label}</button>`).join("")}</div>`;
      return head("MEMBER RECORD", "Member 360", "See the current issue, source evidence, and open actions.") + caseHeader(m) + `<div class="grid"><div>${panel("Member timeline", tabs + (list.length ? list.map(record).join("") : empty("No connected records in this category.")))}
      ${panel("Case activity", audit(m.id), "top-space")}</div><div>${summary(m)}</div></div>`;
    }
    function noteData(form) {
      const f = new FormData(form);
      return {
        ...Object.fromEntries(f),
        interpreter: f.has("interpreter"),
        reviewed: f.has("reviewed"),
        permissionConfirmed: f.has("permissionConfirmed"),
        generated: form.dataset.generated || ""
      };
    }
    function permissionFields(policy, draft) {
      if (!policy) return "";
      return `<fieldset class="form evidence-fields" data-permission>
      <legend>Scoped outreach permission</legend>
      <label>Permission source<select name="permissionSource"><option value="">Choose source</option>
        ${options(policy.sources, draft.permissionSource)}</select></label>
      <label>Permission scope<select name="permissionScope"><option value="">Choose scope</option>
        ${options([policy.scope], draft.permissionScope)}</select></label>
      <label>Permission reference<input name="permissionReference" maxlength="120"
        value="${e(draft.permissionReference)}" placeholder="Demo consent or contact record reference"></label>
      <label class="check"><input name="permissionConfirmed" type="checkbox" ${draft.permissionConfirmed ? "checked" : ""}> ${e(policy.label)}</label>
    </fieldset>`;
    }
    function outreach(m) {
      const draft = unsaved.get(m.id) || data.drafts[m.id] || {};
      const channels = m.blocked ? ["Verified alternative"] : ["Phone", "Verified alternative", "Approved portal", ...m.caregiver ? ["Authorized caregiver"] : []];
      const recent = records(m.id).filter((r) => ["Outreach", "Contact"].includes(r.domain));
      const notes = data.notes.filter((n) => n.member === m.id);
      const form = `<div class="pad note-panel"><div class="row-flex"><h2>Activity note</h2>
      ${badge(data.drafts[m.id] ? "Draft saved" : "Clinician review required", "Incomplete")}</div>
      <p class="tiny">The template briefing uses source evidence. Record your own observations before signing.</p>
      <div id="draft-warning"></div><hr class="divider">
      <form id="note-form" class="form" data-generated="${e(draft.generated)}">
      <div class="field-grid"><label>Activity type<select name="type">${options(["Pre-contact briefing", "Outreach", "Route investigation", "Care coordination"], draft.type || "Outreach")}</select></label>
      <label data-contact>Contact channel<select name="channel">${options(channels, draft.channel)}</select></label></div>
      <p class="tiny" data-investigation hidden>Use this activity to investigate a route or consent. Outcomes excludes these notes from outreach attempts.</p>
      <label data-contact data-standard-route>Verified route and permission<input name="route" maxlength="300" value="${e(draft.route)}" placeholder="Verification reference"></label>
      ${permissionFields(m.contactPermission, draft)}
      <label data-contact>Observed outcome<select name="outcome"><option value="">Select outcome</option>${options(["Connected", "Voicemail", "No answer", "Disconnected"], draft.outcome)}</select></label>
      ${m.interpreter ? `<label data-contact class="check"><input type="checkbox" name="interpreter" ${draft.interpreter ? "checked" : ""}> Spanish interpreter supported this encounter</label>` : ""}
      <label>Note text<textarea name="text" maxlength="3000" placeholder="Enter observed details\u2026">${e(draft.text)}</textarea></label>
      <label>Follow-up task title (optional)<input name="followUp" maxlength="140" value="${e(draft.followUp)}" placeholder="Example: Confirm transportation pickup"></label>
      <label class="check"><input type="checkbox" name="reviewed"> I reviewed the note and confirmed the details I entered</label>
      <div class="actions">${btn("Prepare template briefing", "briefing")}${btn("Save draft", "draft")}
      <button class="button primary" type="submit">Sign note</button></div><p class="error" aria-live="polite"></p></form></div>`;
      return head("CASE EXECUTION", "Outreach & documentation", "Review contact guidance and document the outcome of a simulated action.") + caseHeader(m) + `<div class="split"><div>${panel("Contact guidance", `<div class="pad"><div class="warning ${m.blocked ? "urgent" : ""}">${e(m.contact)}</div>
      ${refs(recent.map((r) => r.id))}</div>`)}${panel("Previous source attempts", recent.filter((r) => r.domain === "Outreach").map(record).join("") || empty("No previous attempts in the connected record."), "top-space")}
      </div><div><section class="panel">${form}</section>${panel("Signed notes", notes.map((n) => `<article class="record">
      <h3>${e(n.type)} \xB7 ${e(n.actor)}</h3><p class="tiny">${detail(n.at)}${n.outcome ? " \xB7 " + e(n.outcome) : ""}</p>
      <p class="sub pre">${e(n.text)}</p>${n.permission ? `<p class="tiny">Permission \xB7 ${e(n.permission.source)} \xB7 ${e(n.permission.scope)} \xB7 ${e(n.permission.reference)}</p>` : ""}
      ${n.permissionReview ? badge("Prior permission needs review", "Incomplete") : ""}</article>`).join("") || empty("No signed notes for this case."), "top-space")}</div></div>`;
    }
    function coord(m) {
      const tasks = data.tasks.filter((t) => !scope || scope === t.member).sort((a, b) => Number(a.status === "Verified") - Number(b.status === "Verified") || a.due.localeCompare(b.due) || a.id.localeCompare(b.id));
      const list = `<section class="panel"><div class="panel-header"><div><h2>${scope ? "Case tasks" : "Across-case tasks"}</h2>
      <p class="tiny">${tasks.filter((t) => t.status !== "Verified").length} open \xB7 Simulation due dates</p></div>
      ${scope ? `<div class="actions">${btn("All cases", "coord")}${btn("Add task", "task-create", "", "primary")}</div>` : ""}</div>
      <ul class="task-list">${tasks.map((t) => `<li><div><h3>${e(t.title)}</h3>
      ${!scope ? btn(data.cases.find((c) => c.id === t.member).name, "coord", t.member, "task-member") : ""}
      <p class="tiny">${e(t.owner)} \xB7 Due ${detail(t.due)}</p><p class="tiny">Outcome required \xB7 ${e(t.outcome)}</p>
      ${t.verification ? `<p class="tiny">${t.verification.kind === "attestation" ? "Clinician attestation" : "Connected evidence"} \xB7 ${e(t.verification.reference)} \xB7 ${e(t.verification.disposition)}
      \xB7 ${e(t.verification.source)} \xB7 ${detail(t.verification.time)}</p>` : ""}
      ${refs([...new Set([t.source, t.verification?.kind === "record" ? t.verification.reference : null].filter(Boolean))])}</div>
      <div class="actions">${badge(t.status, t.status === "Verified" ? "Verified" : "Incomplete")}
      ${t.status === "Open" ? btn("Start", "task-start", t.id) : ""}
      ${t.status !== "Verified" ? btn("Handoff / escalate", "task-handoff", t.id) + btn("Verify outcome", "task-verify", t.id) : ""}</div></li>`).join("")}</ul></section>`;
      const status = scope ? records(m.id).filter((r) => ["Authorization", "Appointments", "HomeHealth", "Referral"].includes(r.domain) || ["R059", "SIM-RIDE-001"].includes(r.id)) : [];
      return head("CASE EXECUTION", "Care coordination", "Assign follow-up, track partner status, and verify each outcome.") + (scope ? caseHeader(m) + `<div class="grid"><div>${list}</div><div>${panel("Partner evidence", status.map(record).join("") || empty("No partner status records."))}
      ${panel("Activity audit", audit(m.id), "top-space")}</div></div>` : list);
    }
    function importResult() {
      if (!preview) return "";
      if (preview.error) return `<p class="error">${e(preview.error)}</p>`;
      return `<b>${e(importFile.name)}</b><p class="sub">${preview.accepted} new \xB7 ${preview.duplicates} duplicates \xB7 ${preview.errors.length} rejected</p>
      ${preview.errors.length ? `<ul class="error">${preview.errors.slice(0, 12).map((x) => `<li>Row ${x.row} \xB7 ${e(x.id)} ${e(x.reason)}</li>`).join("")}</ul>` : ""}
      <div class="actions top-space">${btn("Commit import", "import", "", "primary", !!preview.errors.length || !preview.accepted)}</div>`;
    }
    function integrity() {
      const issues = data.records.filter((r) => ["Conflict", "Delayed", "Missing", "Stale", "Incomplete", "Restricted"].includes(r.quality));
      const batches = data.imports.map((b) => `<article class="record"><h3>${e(b.name)}</h3>
      <p class="tiny">${detail(b.at)} \xB7 ${b.added} added \xB7 ${b.duplicates} duplicates</p></article>`).join("");
      const replay = data.replay.map((r) => `<article class="record"><h3>${e(r.title)}</h3>
      <p class="tiny">Nina Shah \xB7 Receipt ${detail(r.received)}</p><div class="actions top-space">${r.played ? badge("Replayed", "Verified") : btn(r.id === "payer-update" ? "Replay payer update" : "Replay transport update", "replay", r.id, "", !r.available)}</div></article>`).join("");
      const catalog = data.catalog.map(([domain, source, access, cadence, issue]) => {
        const matching = data.records.filter((r) => r.domain === domain);
        const latest = matching.map((r) => r.received).sort().at(-1);
        return `<details class="record"><summary>${e(domain.replaceAll("_", " "))} \xB7 ${matching.length} records</summary>
      <p class="sub">${e(source)} \xB7 ${e(access)}</p><p class="tiny">Expected cadence \xB7 ${e(cadence)}</p>
      <p class="tiny">Latest receipt \xB7 ${detail(latest)}</p><p class="tiny">${e(issue)}</p></details>`;
      }).join("");
      return head("SOURCE OPERATIONS", "Data integrity", "Validate standardized records and trace discrepancies to their source.") + `<div class="split"><div>${panel("Standardized records import", `<div class="pad form">
      <label>Choose a records CSV<input id="csv-file" type="file" accept=".csv,text/csv"></label>
      <p class="tiny">Preview required fields, duplicates, and rejected rows before committing.</p>
      <div id="import-preview" aria-live="polite">${importResult()}</div></div>`)}
      ${panel("Import history", batches || empty("The baseline was seeded from the verified workbook."), "top-space")}</div>
      <div>${panel("Replay synthetic evidence", replay + `<div class="pad">${btn("Advance clock", "advance")}</div>`)}
      ${panel("Source catalog", `<div class="catalog-list">${catalog}</div>`, "top-space")}</div></div>
      ${panel("Evidence that needs attention", `<div class="table-wrap"><table aria-label="Data discrepancies"><thead><tr>
      <th>Record</th><th>Member</th><th>Source issue</th><th>Flag</th><th>Received</th></tr></thead><tbody>
      ${issues.map((r) => `<tr><td>${refs([r.id])}</td><td>${e(r.member)}</td><td>${e(r.title)}</td><td>${badge(r.quality)}</td>
      <td>${detail(r.received)}</td></tr>`).join("")}</tbody></table></div>`, "top-space")}`;
    }
    function outcomes() {
      const m = data.metrics;
      const stat = (value, label, hint) => `<div class="stat"><b>${value}</b><span>${label}</span><small>${hint}</small></div>`;
      return head("DEMO OPERATIONS", "Outcomes", "Metrics reflect actions recorded since the Monday baseline.") + `<section class="stats" aria-label="Recorded outcomes">${stat(m.open, "Open tasks", m.overdue + " overdue")}
      ${stat(m.verified, "Verified closures", "Evidence-backed task outcomes")}
      ${stat(m.attempts, "Outreach attempts", "Signed simulated outreach notes")}
      ${stat(m.attempts ? Math.round(m.connected / m.attempts * 100) + "%" : "\u2014", "Connection rate", m.connected + " connected / " + m.attempts + " attempts")}</section>` + panel("Activity audit", audit());
    }
    const pages = { queue, member: memberPage, outreach, coord, integrity, outcomes };
    function syncNote() {
      const form = $("#note-form");
      if (!form) return;
      const outreach2 = form.elements.type.value === "Outreach";
      const needsPermission = outreach2 && (member().blocked || form.elements.channel.value === "Authorized caregiver");
      form.querySelectorAll("[data-contact]").forEach((field) => {
        field.hidden = !outreach2;
      });
      form.querySelector("[data-standard-route]").hidden = !outreach2 || needsPermission;
      const permission = form.querySelector("[data-permission]");
      if (permission) {
        permission.hidden = !needsPermission;
        permission.disabled = !needsPermission;
      }
      form.querySelector("[data-investigation]").hidden = form.elements.type.value !== "Route investigation";
      const warning = $("#draft-warning");
      if (warning.dataset.revision !== String(data.revision)) {
        warning.innerHTML = newEvidence(member());
        warning.dataset.revision = data.revision;
      }
      $(".heading .date").innerHTML = "<strong>" + e(data.clock.slice(0, 10)) + "</strong>" + clock(data.clock) + " \xB7 Simulation clock";
      form.querySelector("[type=submit]").disabled = updates(selected).length > 0;
    }
    function render(focus = false) {
      revision = data.revision;
      $("#crumb").textContent = "Care management / " + names[view];
      const current = ["member", "outreach"].includes(view) ? "queue" : view;
      $("#nav").innerHTML = Object.keys(icons).map((id) => `<button class="nav-button" type="button" data-do="${id}"
      aria-label="${names[id]}" ${id === current ? 'aria-current="page"' : ""}><svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      ${icons[id]}</svg><span>${names[id]}</span></button>`).join("");
      main.innerHTML = pages[view](member());
      main.removeAttribute("aria-busy");
      if (view === "queue") drawRows();
      if (view === "outreach") syncNote();
      if (focus) main.focus({ preventScroll: true });
    }
    function routeFromHash() {
      if (!data) return;
      if (view === "queue") queueScroll = window.scrollY;
      const [destination, id] = location.hash.slice(1).split("/");
      view = Object.hasOwn(pages, destination) ? destination : "queue";
      scope = data.cases.some((m) => m.id === id) ? id : "";
      if (scope && selected !== scope) {
        selected = scope;
        category = "overview";
      }
      if (["member", "outreach"].includes(view) && !member()) view = "queue";
      render(true);
      window.scrollTo(0, view === "queue" ? queueScroll : 0);
    }
    function navigate(destination, id) {
      if (modal.open) modal.close();
      const caseId = id || (["member", "outreach"].includes(destination) ? selected : "");
      const hash = "#" + destination + (caseId ? "/" + caseId : "");
      if (location.hash !== hash) history.pushState(null, "", hash);
      routeFromHash();
    }
    function announce(message) {
      clearTimeout(toastTimer);
      $("#toast").textContent = message;
      toastTimer = setTimeout(() => {
        $("#toast").textContent = "";
      }, 5e3);
    }
    async function api(url, body) {
      const response = await window.hilabsFetch(url, body ? {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body)
      } : { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) {
        const error = new Error(result.error);
        error.state = result.state;
        throw error;
      }
      return result;
    }
    async function mutate(action, body) {
      if (active) return false;
      active = true;
      try {
        const result = await api("/api/action", { ...body, action, revision, requestId: crypto.randomUUID() });
        data = result.state;
        announce(result.message);
        return true;
      } catch (error) {
        if (error.state) data = error.state;
        throw error;
      } finally {
        active = false;
      }
    }
    function showModal(title, body) {
      if (!modal.open) returnFocus = document.activeElement;
      modal.innerHTML = `<h2 id="modal-title">${e(title)}</h2><div class="top-space">${body}</div>`;
      if (!modal.open) modal.showModal();
      else modal.querySelector("button,input,textarea")?.focus();
    }
    function showForm(title, action, body, label, id = "") {
      showModal(title, `<form id="action-form" class="form" data-action="${action}" data-id="${e(id)}">${body}
      <p class="error" aria-live="polite"></p><div class="actions"><button class="button primary" type="submit">${label}</button>
      ${btn("Cancel", "dismiss")}</div></form>`);
    }
    const findTask = (id) => data.tasks.find((task) => task.id === id);
    const findRecord2 = (id) => data.records.find((item) => item.id === id);
    const dateField = (name, label, value) => `<label>${label}<input type="datetime-local" name="${name}"
    value="${e(value.replace(" ", "T"))}" required></label>`;
    const dueField = (value = data.clock.slice(0, 10) + " 17:00") => dateField("due", "Due date and time (ET)", value);
    function taskForm(action, id) {
      const task = findTask(id);
      if (action === "task-create") {
        showForm("Add coordination task", action, `<label>Task title<input name="title" maxlength="140" required></label>
        <label>Owner<input name="owner" maxlength="140" required></label>${dueField()}
        <label>Outcome required<textarea name="outcome" maxlength="300" required></textarea></label>`, "Add task");
      } else if (task && action === "task-handoff") {
        showForm("Hand off or escalate task", action, `<p class="sub">${e(task.title)}</p>
        <label>New owner<input name="owner" maxlength="140" value="${e(task.owner)}" required></label>${dueField(task.due)}
        <label>Handoff reason<textarea name="detail" maxlength="600" required></textarea></label>
        <label class="check"><input name="escalate" type="checkbox"> Mark as escalated</label>`, "Save handoff", id);
      } else if (task) {
        showForm(
          "Verify task outcome",
          action,
          `<p class="sub">${e(task.title)} \xB7 ${e(task.outcome)}</p>
        <label>Evidence method<select name="verificationMode"><option value="record">Connected source record</option>
          <option value="attestation">External clinician attestation</option></select></label>
        <label>Outcome source reference<input name="evidence" maxlength="140" required></label>
        <fieldset class="form evidence-fields" data-attestation hidden disabled>
          <legend>External confirmation</legend>
          <p class="tiny">Confirm the disposition with the ${e(task.outcomePolicy.source)}.</p>
          <label>Source name<input name="outcomeSource" maxlength="140" required></label>
          ${dateField("outcomeTime", "Confirmation time (ET)", data.clock)}
          <label>Confirmed disposition<select name="disposition" required><option value="">Choose disposition</option>
            ${options([task.outcomePolicy.disposition])}</select></label>
          <label class="check"><input name="outcomeConfirmed" type="checkbox" required> I verified this outcome with the named source</label>
        </fieldset>`,
          "Verify and close task",
          id
        );
      }
    }
    function prepareBriefing() {
      const form = $("#note-form");
      const field = form.elements.text;
      if (field.value.trim() && field.value.trim() !== form.dataset.generated.trim()) {
        form.querySelector(".error").textContent = "Clear the note text before inserting a briefing.";
        return;
      }
      const m = member();
      field.value = "Template briefing for " + m.name + ".\nEvidence: " + m.why + "\nSuggested next step for clinician review: " + m.next + "\nSources: " + m.evidence.join(", ") + ".";
      form.dataset.generated = field.value;
      form.elements.type.value = "Pre-contact briefing";
      form.elements.reviewed.checked = false;
      unsaved.set(selected, noteData(form));
      syncNote();
      field.focus();
    }
    async function saveNote(action, form) {
      const id = selected, body = noteData(form);
      unsaved.set(id, body);
      try {
        if (!await mutate(action, { ...body, member: id })) return;
        unsaved.delete(id);
        render(true);
      } catch (error) {
        if (error.state) render();
        $("#note-form")?.querySelector(".error")?.replaceChildren(error.message);
      }
    }
    async function run(action, body) {
      try {
        if (!await mutate(action, body)) return;
        if (action === "import") {
          preview = null;
          importFile = null;
        }
        render(true);
      } catch (error) {
        if (error.state) render();
        announce(error.message);
      }
    }
    function drawer() {
      if (member()) showModal("Case preview", summary(member()) + `<div class="actions">${btn("Close", "dismiss")}</div>`);
    }
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-do]");
      if (!button || !data) return;
      const { do: action, id } = button.dataset;
      if (Object.hasOwn(pages, action)) {
        navigate(action, id);
        return;
      }
      switch (action) {
        case "select":
          selected = id;
          category = "overview";
          drawRows();
          $('#queue-rows [data-id="' + CSS.escape(id) + '"]')?.focus();
          if (matchMedia("(max-width: 890px)").matches) drawer();
          break;
        case "preview":
          drawer();
          break;
        case "category":
          category = id;
          render();
          $('[data-do="category"][data-id="' + id + '"]')?.focus();
          break;
        case "source": {
          const r = findRecord2(id);
          if (r) showModal("Source record " + id, record(r) + `<div class="actions">${btn("Open Member 360", "member", r.member)}
          ${view === "integrity" && r.quality !== "Restricted" ? btn("Reconcile / verify", "reconcile", id) : ""}${btn("Close", "dismiss")}</div>`);
          break;
        }
        case "dismiss":
          modal.close();
          break;
        case "briefing":
          prepareBriefing();
          break;
        case "draft":
          void saveNote(action, $("#note-form"));
          break;
        case "review":
          if (view === "outreach") unsaved.set(selected, noteData($("#note-form")));
          if (modal.open) modal.close();
          void run(action, { member: selected, ids: id.split(",") });
          break;
        case "replay":
          void run(action, { id });
          break;
        case "import":
          if (importFile) void run(action, { csv: importFile.text, filename: importFile.name });
          break;
        case "advance":
          showForm("Advance simulation clock", action, dateField("clock", "Snapshot (ET)", data.clock), "Advance clock");
          break;
        case "reconcile":
          showForm("Reconcile source " + id, action, `<label>Verification or reconciliation detail<textarea name="detail" maxlength="600" required></textarea></label>
          <label class="check"><input name="createTask" type="checkbox"> Create a verification task for Maria</label>`, "Save reconciliation", id);
          break;
        case "task-start":
          if (findTask(id)) void run(action, { id, member: findTask(id).member });
          break;
        case "task-create":
        case "task-handoff":
        case "task-verify":
          taskForm(action, id);
          break;
      }
    });
    document.addEventListener("submit", async (event) => {
      const form = event.target;
      if (!["note-form", "action-form"].includes(form.id)) return;
      event.preventDefault();
      if (form.id === "note-form") {
        void saveNote("sign", form);
        return;
      }
      const { action, id } = form.dataset;
      const fields2 = new FormData(form);
      const body = { ...Object.fromEntries(fields2), id, member: findTask(id)?.member || selected };
      if (body.due) body.due = body.due.replace("T", " ");
      if (body.clock) body.clock = body.clock.replace("T", " ");
      if (body.outcomeTime) body.outcomeTime = body.outcomeTime.replace("T", " ");
      if (action === "task-verify") body.outcomeConfirmed = fields2.has("outcomeConfirmed");
      if (action === "task-handoff") body.escalate = fields2.has("escalate");
      if (action === "reconcile") {
        body.member = findRecord2(id)?.member;
        body.createTask = fields2.has("createTask");
      }
      try {
        if (!await mutate(action, body)) return;
        modal.close();
        if (action === "reset") {
          unsaved.clear();
          selected = "M-1006";
          filter = "today";
          sort = "priority";
          category = "overview";
          search = "";
          queueScroll = 0;
          importFile = null;
          preview = null;
          navigate("queue");
        } else {
          render(true);
        }
      } catch (error) {
        form.querySelector(".error").textContent = error.message;
        if (error.state) {
          form.querySelector("[type=submit]").disabled = true;
          render();
        }
      }
    });
    document.addEventListener("input", (event) => {
      if (event.target.id === "search") {
        search = event.target.value;
        drawRows();
      }
      const form = event.target.closest("#note-form");
      if (form && event.target.name !== "reviewed") {
        form.elements.reviewed.checked = false;
        if (["permissionSource", "permissionScope", "permissionReference"].includes(event.target.name)) {
          form.elements.permissionConfirmed.checked = false;
        }
        form.querySelector(".error").textContent = "";
        unsaved.set(selected, noteData(form));
      }
    });
    document.addEventListener("change", async (event) => {
      const { id, value } = event.target;
      if (id === "filter") {
        filter = value;
        drawRows();
      }
      if (id === "sort") {
        sort = value;
        drawRows();
      }
      if (["type", "channel"].includes(event.target.name) && view === "outreach") {
        const form = $("#note-form");
        if (event.target.name === "channel" && form.elements.permissionConfirmed) {
          form.elements.permissionConfirmed.checked = false;
        }
        syncNote();
        unsaved.set(selected, noteData(form));
      }
      if (event.target.name === "verificationMode") {
        const attestation = event.target.form.querySelector("[data-attestation]");
        attestation.hidden = value !== "attestation";
        attestation.disabled = attestation.hidden;
      }
      if (id !== "csv-file") return;
      const file = event.target.files[0];
      if (!file) return;
      const pendingFile = { name: file.name };
      importFile = pendingFile;
      preview = { error: "Validating the selected CSV\u2026" };
      $("#import-preview").innerHTML = importResult();
      let result;
      try {
        if (file.size > 25e4) throw new Error("Choose a CSV smaller than 250 KB.");
        pendingFile.text = await file.text();
        result = await api("/api/import/preview", { csv: pendingFile.text });
      } catch (error) {
        result = { error: error.message };
      }
      if (importFile !== pendingFile) return;
      preview = result;
      if ($("#import-preview")) $("#import-preview").innerHTML = importResult();
    });
    modal.addEventListener("close", () => {
      if (returnFocus?.isConnected) returnFocus.focus();
    });
    $("#reset").addEventListener("click", () => {
      if (data) showForm("Reset demo", "reset", '<p class="sub">Restore the six-case Monday baseline and clear demo actions from this database.</p>', "Restore baseline");
    });
    $(".skip").addEventListener("click", (event) => {
      event.preventDefault();
      main.focus();
    });
    window.addEventListener("popstate", routeFromHash);
    setInterval(async () => {
      if (!data || view !== "outreach" || active || document.hidden) return;
      try {
        const fresh = await api("/api/state");
        if (view === "outreach" && !active && fresh.revision > data.revision) {
          data = fresh;
          syncNote();
        }
      } catch {
      }
    }, 5e3);
    api("/api/state").then((result) => {
      data = result;
      routeFromHash();
    }).catch(() => {
      main.removeAttribute("aria-busy");
      main.innerHTML = '<p class="empty" role="alert">Could not load the workbench. Refresh to try again.</p>';
    });
  })();
})();
