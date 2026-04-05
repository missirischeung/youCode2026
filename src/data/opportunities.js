import kitchenImg from "../assets/kitchen.png";
import gardenImg from "../assets/gardener.png";
const opportunities = [
    {
        id: 1,
        title: "Community Kitchen Drop-In",
        organization: "Sunrise Community Centre",
        description:
            "Help prep vegetables, set tables, and share a meal with a small group. No cooking experience needed.",
        location: "East Vancouver",
        schedule: "Every Tuesday",
        effortLevel: 1,
        timeRange: '10am-2pm',
        cost: "Free",
        transitSupport: "Bus #20, 12 min",
        beginnerFriendly: true,
        impact: "Helps feed 40+ neighbours each week",
        whyItHelps:
            "A low-pressure way to be around people again — no sign-up, no commitment, just show up when you feel ready.",
        barrierSupport: ["Drop-in, no sign-up", "Bring nothing"],
        tags: [
            "Kids welcome",
            "OK to come alone",
            "Quiet, small group",
        ],
        builds: ["Cooking basics", "Teamwork", "Confidence"],
        skills: ["Cooking basics", "Teamwork", "Confidence"],
        nextStepLabel: "I'm in",
        activities: [
            "Help prep ingredients for the community meal",
            "Serve food and greet neighbours during the drop-in",
            "Tidy shared kitchen stations after service",
          ],
          
          website: "https://sunrise.example.org",
          contactName: "Maya Chen",
          contactEmail: "maya@sunrise.org",
          image: kitchenImg,
    },

    {
        id: 2,
        title: "Garden Help Hour",
        organization: "Neighbourhood Food Hub",
        description:
            "Water plants, sort herbs, and help tidy the garden beds with a friendly team outdoors.",
        location: "Mount Pleasant",
        past: true,
        effortLevel: 2,
        schedule: "Saturday mornings",
        timeRange: '10am-2pm',
        cost: "Free",
        transitSupport: "Near Broadway-City Hall",
        beginnerFriendly: true,
        impact: "Supports fresh produce for local families",
        whyItHelps:
            "A gentle way to ease into volunteering with clear tasks and fresh air.",
        barrierSupport: ["Drop-in welcome"],
        tags: ["OK to come alone", "Quiet, small group"],
        builds: ["Routine", "Confidence", "Responsibility"],
        skills: ["Gardening basics", "Teamwork"],
        nextStepLabel: "I'm in",
        activities: [
            "Help prep ingredients for the community meal",
            "Serve food and greet neighbours during the drop-in",
            "Tidy shared kitchen stations after service",
          ],
          
          website: "https://sunrise.example.org",
          contactName: "Maya Chen",
          contactEmail: "maya@sunrise.org",
          image: gardenImg,
    },
];

export default opportunities;
