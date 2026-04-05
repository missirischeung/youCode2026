import kitchenImg from "../assets/kitchen.png";
import gardenImg from "../assets/gardener.png";
import dogWalkImg from "../assets/dogWalk.png";
import seniorCareImg from "../assets/seniorCareImg.png";
const opportunities = [
    {
        id: 1,
        title: "Community Kitchen Drop-In",
        organization: "Comissary Connect",
        description:
            "Help prep vegetables, set tables, and share a meal with a small group. No cooking experience needed.",
        location: "401 Industrial Ave, Vancouver, BC V6A 2P8",
        schedule: "Every Tuesday",
        effortLevel: 1,
        timeRange: '10am-12pm',
        cost: "Free",
        transitSupport: "401 Industrial Ave, Vancouver, BC V6A 2P8",
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
        nextStepLabel: "Let's get Cooking",
        activities: [
            "Help prep ingredients for the community meal",
            "Serve food and greet neighbours during the drop-in",
            "Tidy shared kitchen stations after service",
          ],
          
          website: "https://commissaryconnect.com",
          contactName: "ComissaryConnect",
          contactEmail: "info@commissaryconnect.comg",
          image: kitchenImg,
    },

    {
        id: 2,
        title: "Garden Help Hour",
        organization: "Blossom Landscaping",
        description:
            "Water plants, sort herbs, and help tidy the garden beds with a friendly team outdoors.",
        location: "3158 W 34th Ave, Vancouver, BC V6N 2S2",
        past: true,
        effortLevel: 2,
        schedule: "Saturday mornings",
        timeRange: '9am-11am',
        cost: "Free",
        transitSupport: "3158 W 34th Ave, Vancouver, BC V6N 2S2",
        beginnerFriendly: true,
        impact: "Supports fresh produce for local families",
        whyItHelps:
            "A gentle way to ease into volunteering with clear tasks and fresh air.",
        barrierSupport: ["Drop-in welcome"],
        tags: ["OK to come alone", "Quiet, small group"],
        builds: ["Routine", "Confidence", "Responsibility"],
        skills: ["Gardening basics", "Teamwork"],
        nextStepLabel: "Time to plant!",
        activities: [
            "Help prep ingredients for the community meal",
            "Serve food and greet neighbours during the drop-in",
            "Tidy shared kitchen stations after service",
          ],
          
          website: "https://blossomvancouver.ca",
          contactName: "Blossom",
          contactEmail: "Blossomscaping@gmail.com",
          image: gardenImg,
    },
    {
        id: 3,
        title: "Dog Walking Volunteer",
        organization: "BC SPCA Vancouver",
        description:
            "Help local rescue dogs get exercise and socialization by taking them for walks around the neighborhood.",
        location: "North building, 1205 E 7th Ave, Vancouver, BC V5T 1R1",
        effortLevel: 1,
        schedule: "Flexible weekdays & weekends",
        timeRange: "2pm-4pm",
        cost: "Free",
        transitSupport: "North building, 1205 E 7th Ave, Vancouver, BC V5T 1R1",
        beginnerFriendly: true,
        impact: "Provides exercise, socialization, and stress relief for rescue dogs",
        whyItHelps:
            "Many dogs in rescues spend long hours indoors — your walks make a huge difference in their wellbeing.",
        barrierSupport: ["No prior experience needed", "Must be comfortable with dogs"],
        tags: ["OK to come alone", "Quiet, small group", "Animal-friendly"],
        builds: ["Responsibility", "Animal care", "Consistency"],
        skills: ["Dog handling", "Time management", "Patience"],
        nextStepLabel: "Let's walk!",
        activities: [
            "Pick up assigned rescue dog",
            "Take dog on a safe, supervised walk",
            "Ensure dog returns safely and document any notes about behavior",
        ],
        website: "https://spca.bc.ca/locations/vancouver/",
        contactName: "Vancouver SPCA",
        contactEmail: "vancouver@spca.bc.ca",
        image: dogWalkImg,
    },
    {
        id: 4,
        title: "Senior Companion Volunteer",
        organization: "Arbutus Care Centre",
        description:
            "Spend time with residents by chatting, playing games, or helping with light activities. Brighten their day with your company!",
        location: "4505 Valley Dr, Vancouver, BC, V6L 2L1",
        effortLevel: 3,
        schedule: "Saturday and Sunday Afternoons",
        timeRange: "1pm-5pm",
        cost: "Free",
        transitSupport: "4505 Valley Dr, Vancouver, BC, V6L 2L1",
        beginnerFriendly: true,
        impact: "Provides companionship and emotional support to seniors",
        whyItHelps:
            "Many seniors experience isolation. Your presence can improve their mood and sense of connection.",
        barrierSupport: ["No experience required", "Must be patient and kind"],
        tags: ["OK to come alone", "Quiet, small group", "Intergenerational"],
        builds: ["Empathy", "Communication skills", "Patience"],
        skills: ["Active listening", "Teamwork", "Compassion"],
        nextStepLabel: "Let's Connect",
        activities: [
            "Chat and interact with residents",
            "Assist with light recreational activities",
            "Help with arts & crafts or games",
            "Offer friendly support during mealtime or events",
        ],
        website: "https://www.agecare.ca/communities/arbutus-care-centre/",
        contactName: "ArbutusCare",
        contactEmail: "arbutus@agecare.ca",
        image: seniorCareImg,
    },
];

export default opportunities;
