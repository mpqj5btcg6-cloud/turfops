const STORE = "turfops.v1";
const HEAD_PRESETS = {
  "RB 15' spray Q": { type: "spray", radiusFt: 15, arc: 90, gpm: 0.79 },
  "RB 15' spray H": { type: "spray", radiusFt: 15, arc: 180, gpm: 1.58 },
  "RB 15' spray F": { type: "spray", radiusFt: 15, arc: 360, gpm: 3.16 },
  "RB 5000 rotor Q 25'": { type: "rotor", radiusFt: 25, arc: 90, gpm: 1.00 },
  "RB 5000 rotor H 25'": { type: "rotor", radiusFt: 25, arc: 180, gpm: 1.98 },
  "RB 5000 rotor F 25'": { type: "rotor", radiusFt: 25, arc: 360, gpm: 3.88 },
  "MP2000 180": { type: "mp", radiusFt: 19, arc: 180, gpm: 0.77 },
  "MP2000 360": { type: "mp", radiusFt: 21, arc: 360, gpm: 1.48 },
  "MP3000 180": { type: "mp", radiusFt: 30, arc: 180, gpm: 1.82 },
  "Drip / bubbler": { type: "drip", radiusFt: 2, arc: 360, gpm: 0.25 }
};
const GRASS = {
  bermuda: { label: "Bermuda", annualN: [3, 5], mow: "1-2 in", weeklyIn: 1.0, events: [
    { id: "pre1", month: 2, day: 20, name: "Spring pre-emergent", product: "Prodiamine (Barricade) or dithiopyr (Dimension)", rate: "Label rate / 1,000 sq ft", nLb: 0, notes: "Soil ~55F. Do not core-aerate after." },
    { id: "n1", month: 3, day: 25, name: "First nitrogen", product: "Slow-release 21-0-0 or 15-0-15", rate: "0.75 lb actual N / 1,000 sq ft", nLb: 0.75, notes: "After 50%+ green-up. Water in 0.25-0.5 in." },
    { id: "n2", month: 5, day: 20, name: "Late-spring feed", product: "Slow-release 16-0-8 or 15-0-15 + iron", rate: "1.0 lb actual N / 1,000 sq ft", nLb: 1.0, notes: "Iron optional on alkaline clay." },
    { id: "n3", month: 7, day: 5, name: "Summer maintenance N", product: "15-0-15 or 21-0-0 slow-release", rate: "0.75 lb actual N / 1,000 sq ft", nLb: 0.75, notes: "Skip if heat-stressed." },
    { id: "pre2", month: 9, day: 5, name: "Fall pre-emergent", product: "Prodiamine or dithiopyr", rate: "Label rate / 1,000 sq ft", nLb: 0, notes: "Winter weeds." },
    { id: "win", month: 10, day: 8, name: "Winterizer", product: "10-0-20 or 5-0-20", rate: "0.4 lb N / 1,000 sq ft", nLb: 0.4, notes: "No high N after mid-October." }
  ]},
  staugustine: { label: "St. Augustine", annualN: [2, 4], mow: "2.5-3.5 in", weeklyIn: 1.2, events: [
    { id: "pre1", month: 2, day: 20, name: "Spring pre-emergent", product: "Atrazine (labeled) or prodiamine", rate: "Label rate / 1,000 sq ft", nLb: 0, notes: "Do not use atrazine on new sod." },
    { id: "n1", month: 4, day: 20, name: "First nitrogen", product: "Slow-release 15-0-15", rate: "0.5 lb actual N / 1,000 sq ft", nLb: 0.5, notes: "Wait until fully green." },
    { id: "iron", month: 5, day: 25, name: "Iron / color", product: "Chelated iron or ferrous sulfate", rate: "Label rate", nLb: 0, notes: "Dallas clay often shows chlorosis." },
    { id: "n2", month: 6, day: 15, name: "Early-summer feed", product: "Slow-release 15-0-15", rate: "0.75 lb actual N / 1,000 sq ft", nLb: 0.75, notes: "Avoid heavy July-August N." },
    { id: "n3", month: 8, day: 20, name: "Late-summer light N", product: "Slow-release 15-0-15", rate: "0.5 lb actual N / 1,000 sq ft", nLb: 0.5, notes: "Skip if disease." },
    { id: "win", month: 10, day: 5, name: "Winterizer (low N)", product: "5-0-20 or 10-0-20", rate: "0.4 lb N / 1,000 sq ft", nLb: 0.4, notes: "Do not push N into fall." }
  ]},
  zoysia: { label: "Zoysia", annualN: [2, 3.5], mow: "1.5-2.5 in", weeklyIn: 0.9, events: [
    { id: "pre1", month: 2, day: 22, name: "Spring pre-emergent", product: "Prodiamine or dithiopyr", rate: "Label rate / 1,000 sq ft", nLb: 0, notes: "Greens later than Bermuda." },
    { id: "n1", month: 4, day: 28, name: "First nitrogen", product: "Slow-release 16-0-8 or 15-0-15", rate: "0.6 lb actual N / 1,000 sq ft", nLb: 0.6, notes: "After full green-up." },
    { id: "n2", month: 6, day: 18, name: "Summer feed", product: "15-0-15 slow-release", rate: "0.75 lb actual N / 1,000 sq ft", nLb: 0.75, notes: "Do not overfeed." },
    { id: "n3", month: 8, day: 20, name: "Optional late N", product: "15-0-15 or iron", rate: "0.4 lb actual N / 1,000 sq ft", nLb: 0.4, notes: "Skip if already dense." },
    { id: "win", month: 10, day: 8, name: "Winterizer", product: "10-0-20", rate: "0.3 lb N / 1,000 sq ft", nLb: 0.3, notes: "Potassium for winter." }
  ]}
};
