export interface SampleNotice {
  id: string;
  name: string;
  category: string;
  preview: string;
  rawText: string;
}

export const SAMPLE_NOTICES: SampleNotice[] = [
  {
    id: "sample-workshop",
    name: "Python & AI Workshop (WhatsApp)",
    category: "Workshop",
    preview: "15 Nov 2026 • 10:00 AM • Seminar Hall 2",
    rawText: `*URGENT NOTICE - DEPARTMENT OF COMPUTER SCIENCE* 🚀
All B.Tech (CSE, IT, AI-DS) 2nd & 3rd year students are hereby informed that the hands-on "Python & Applied Generative AI Workshop" will be conducted on 15 November 2026 from 10:00 AM to 1:00 PM at Seminar Hall 2, Tech Block.

Distinguished industry speaker from Google DeepMind will lead the session.
Participants must carry their laptops with Python 3.11+ pre-installed.
Registration is mandatory. Registration closes strictly on 12 November 2026 at 5:00 PM.
Limited seats available (first come, first served). Certificates will be awarded.`,
  },
  {
    id: "sample-exam",
    name: "Mid-Semester Examination Schedule (Circular)",
    category: "Examination",
    preview: "25 Nov 2026 • 09:30 AM • Examination Block B",
    rawText: `CIRCULAR / COE / 2026-27 / 104
OFFICE OF THE CONTROLLER OF EXAMINATIONS

Subject: Commencement of B.Tech Odd Semester Mid-Term Examinations 2026

It is notified for information of all concerned that the B.Tech Mid-Semester Examinations will commence from 25 November 2026.
Reporting time: 09:30 AM sharp in Examination Block B.
Students without Hall Tickets and college ID cards will strictly NOT be permitted inside the examination hall.
The detailed subject-wise timetable is uploaded on the college portal. Any discrepancy should be reported to the exam cell before 18 November 2026.`,
  },
  {
    id: "sample-assignment",
    name: "Advanced Mathematics Assignment 3 (Email)",
    category: "Assignment",
    preview: "Submission Deadline: 12 Nov 2026 • 11:59 PM",
    rawText: `Dear Students,

Assignment #3 for Advanced Engineering Mathematics (MAT301) has been posted on the student LMS portal.
Topics covered: Laplace Transforms, Fourier Series, and Partial Differential Equations.
The hard copy of handwritten solutions must be submitted to Prof. Sharma's cabin (Room 408) or submitted as a single PDF on LMS no later than 12 November 2026, 11:59 PM.
Late submissions will attract a 20% penalty per day. Plagiarism will result in an immediate zero.`,
  },
  {
    id: "sample-fest",
    name: "Tarang 2026 - Annual Cultural Fest (Poster/Flyer)",
    category: "Cultural Event",
    preview: "20 Nov 2026 • Main Amphitheatre & Ground",
    rawText: `🎉 TARANG 2026 – The Annual Inter-College Cultural Extravaganza! 🎭🎸

Get ready for 3 days of music, dance, theatre, fashion, and rock bands!
Dates: 20 November 2026 to 22 November 2026.
Venue: Campus Main Amphitheatre & Sports Ground.
Events include Battle of the Bands, Street Play, Group Choreography, and DJ Night.
Audition registrations for campus teams are open until 14 November 2026 at the Student Activity Center desk.
Entry is free with valid student ID!`,
  },
  {
    id: "sample-placement",
    name: "TCS / Microsoft Placement Drive (WhatsApp)",
    category: "Placement",
    preview: "Drive on 18 Nov 2026 • Registration ends 13 Nov",
    rawText: `*ATTENTION FINAL YEAR (2027 PASSING OUT BATCH)* 💼
Training & Placement Cell Announcement:

Campus recruitment drive for Software Development Engineer (SDE) roles by Tech Innovations Corp will be held on 18 November 2026 at 09:00 AM in the Central Auditorium.
Eligibility: 65% or 7.0 CGPA throughout 10th, 12th, and B.Tech with no active backlogs.
Eligible students must submit their verified resumes via the Google Form shared in your college email before 13 November 2026, 6:00 PM.
Dress code: Strictly Western Formals. Carry 3 hard copies of resume and 2 passport photos.`,
  },
];

