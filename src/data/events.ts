
export interface EventRound {
    id: number;
    title: string;
    duration: string;
    description: string;
}

export interface Event {
    id: string;
    name: string;
    subtitle?: string; // New field
    category: "Technical" | "Non-Technical" | "Breakout";
    description: string;
    teamSizeMin: number;
    teamSizeMax: number;
    date?: string; // New field
    time?: string; // New field
    location?: string; // New field
    timing: string;
    timeSlot: "morning" | "afternoon" | "fullday" | "flexible";
    rounds?: EventRound[]; // New field
    rules: string[];
    image: string;
    venue?: string;
    ctaText?: string; // New field
}

// Sample events data
export const eventsData: Event[] = [
    // Technical Events
    {
        id: "mindsparkx",
        name: "MindSparkX",
        subtitle: "UNLEASH YOUR COGNITIVE POTENTIAL",
        category: "Technical",
        description: "A fun brain game with image clues, hints, and puzzle challenges.",
        teamSizeMin: 1,
        teamSizeMax: 1,
        date: "FEBRUARY 27, 2026",
        time: "10:30 AM - 04:00 PM",
        location: "LAB 201",
        timing: "10:30 AM - 04:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: PIXEL FUSION", duration: "1 HOUR", description: "Teams will see some images. Find the common link between them." },
            { id: 2, title: "ROUND 2: HIDDENCUE", duration: "2 HOURS", description: "Teams will see some clues. Guess the correct answer." },
            { id: 3, title: "ROUND 3: TREASUREX", duration: "1.5 HOURS", description: "Teams will receive some messages. Encrypt them to find the final answer." }
        ],
        rules: [
            "Individual or team of 3",
            "Score-based qualification for finals",
            "ROUND 1 — PIXEL FUSION: Arena — Image Analysis Terminal. Mission — Identify the common link between the displayed images.",
            "ROUND 2 — HIDDENCUE: Arena — Clue Decryption Zone. Mission — Decode the clues and guess the correct answer.",
            "ROUND 3 — TREASUREX: Arena — Encrypted Message Hub. Mission — Encrypt the received messages to uncover the final answer."
        ],
        image: "/Events_image/mindsparkzx.jpeg",
        ctaText: "ENGAGE MIND"
    },
    {
        id: "designomania",
        name: "Design-O-Mania",
        subtitle: "CRAFT THE FUTURE INTERFACE",
        category: "Technical",
        description: "A design competition where you create wireframes and prototypes using Figma.",
        teamSizeMin: 1,
        teamSizeMax: 1,
        date: "FEBRUARY 27, 2026",
        time: "10:30 AM - 03:45 PM",
        location: "DESIGN STUDIO",
        timing: "10:30 AM - 03:45 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: DESIGN QUAKE", duration: "20 MINS", description: "Answer 20 design MCQs in 20 minutes. No AI or web search permitted." },
            { id: 2, title: "ROUND 2: WIN OR RUN", duration: "60 MINS", description: "Construct a wireframe from scratch based on the theme within 60 minutes." },
            { id: 3, title: "ROUND 3: THE BIG SCORE", duration: "60 MINS", description: "Evolve your wireframe into a functional prototype within 60 minutes." }
        ],
        rules: [
            "Individual participation",
            "Score-based qualification for finals",
            "Bring your own laptop",
            "ROUND 1 — DESIGN QUAKE: Arena — Quiz Terminal. Mission — Answer 20 design MCQs in 20 minutes. No AI or web search permitted.",
            "ROUND 2 — WIN OR RUN: Arena — Figma Creative Suite. Mission — Construct a wireframe from scratch based on the theme within 60 minutes.",
            "ROUND 3 — THE BIG SCORE: Arena — Prototyping Phase. Mission — Evolve your wireframe into a functional prototype within 60 minutes."
        ],
        image: "/Events_image/design-o-mania.jpeg",
        ctaText: "START DESIGNING"
    },
    {
        id: "businessbattle",
        name: "Business Battle",
        subtitle: "STRATEGIZE. PITCH. CONQUER.",
        category: "Technical",
        description: "Pitch your business idea and answer business-related quiz questions.",
        teamSizeMin: 2,
        teamSizeMax: 3,
        date: "FEBRUARY 27, 2026",
        time: "10:00 AM - 03:00 PM",
        location: "SEMINAR HALL A",
        timing: "10:00 AM - 03:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: THE IDEA ARENA", duration: "1 HOUR", description: "Quiz on current market trends and business case studies." },
            { id: 2, title: "ROUND 2: CORPORATE QUIZ ARENA", duration: "2 HOURS", description: "Present your business model to the panel of investors." }
        ],
        rules: [
            "Team of 2–3 members",
            "Case study provided on-site",
            "15 min presentation per team",
            "ROUND 1 — THE IDEA ARENA: Arena — Strategy War Room. Mission — Answer quiz questions on market trends and business case studies.",
            "ROUND 2 — CORPORATE QUIZ ARENA: Arena — Investor Boardroom. Mission — Present your business model to the panel of investors."
        ],
        image: "/Events_image/business battle.jpeg",
        ctaText: "PITCH IDEA"
    },
    {
        id: "fixtheglitch",
        name: "Fix The Glitch",
        subtitle: "DEFY LIMITS. CODE THE IMPOSSIBLE.",
        category: "Technical",
        description: "A coding contest that tests your programming and debugging skills.",
        teamSizeMin: 1,
        teamSizeMax: 1,
        date: "FEBRUARY 27, 2026",
        time: "10:00 AM - 03:00 PM",
        location: "MAIN LAB",
        timing: "10:00 AM - 03:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: CODEIQ", duration: "30 MINS", description: "Multi-language assessment across Python, C, Java, HTML, and JS domains." },
            { id: 2, title: "ROUND 2: FIX IT OR FAIL IT", duration: "90 MINS", description: "Locate and repair critical bugs under extreme time pressure." }
        ],
        rules: [
            "Individual access only — no squad deployment",
            "Total scoring matrix: 90 mark threshold",
            "No external resources or AI assistance permitted",
            "ROUND 1 — CODEIQ: Arena — Multi-Language Terminal. Mission — Execute a 30-minute assessment across five target domains: Python, C, Java, HTML, and JS. Analyze syntax, trace logic, and deploy correct solutions within the batch window.",
            "ROUND 2 — FIX IT OR FAIL IT: Arena — Debug Environment. Mission — Repair critical defects across provided codebases within a 90-minute enforcement window. Failure to resolve all sectors results in mission termination."
        ],
        image: "/Events_image/fix the glitch.jpeg",
        ctaText: "INITIATE SEQUENCE"
    },
    {
        id: "paperpresentation",
        name: "Paper Presentation",
        subtitle: "INNOVATE. ARTICULATE. INSPIRE.",
        category: "Technical",
        description: "Present your innovative ideas and projects within a limited time.",
        teamSizeMin: 3,
        teamSizeMax: 4,
        date: "FEBRUARY 27, 2026",
        time: "10:30 AM - 04:00 PM",
        location: "CONFERENCE HALL",
        timing: "10:30 AM - 04:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: ABSTRACT SUBMISSION", duration: "PRE-EVENT", description: "Submit your paper abstract for initial screening." },
            { id: 2, title: "ROUND 2: FINAL PRESENTATION", duration: "10 MINS", description: "Present your paper to the judges (7 min presentation + 3 min Q&A)." }
        ],
        rules: [
            "Squad configuration: 3–4 operatives per unit",
            "Domain clearance: Student Innovation only",
            "Transmission window: 5–7 minutes per squad presentation",
            "Prototype deployment: All required arrangements must be secured in advance",
            "Access restriction: Only squads with shortlisted abstracts are eligible to present",
            "ROUND 1 — ABSTRACT SUBMISSION: Arena — Pre-Event Screening Terminal. Mission — Submit your research abstract for initial clearance. Only approved dossiers advance to the final stage.",
            "ROUND 2 — FINAL PRESENTATION: Arena — Evaluation Chamber. Mission — Deliver a 7-minute briefing to the panel followed by a 3-minute interrogation. Demonstrate innovation under pressure."
        ],
        image: "/Events_image/paper presentation.jpeg",
        ctaText: "SUBMIT PAPER"
    },
    // Non-Technical Events
    {
        id: "startmusic",
        name: "Start Music",
        subtitle: "RHYTHM REACTOR",
        category: "Non-Technical",
        description: "A music-based game with lyric guessing and song identification rounds.",
        teamSizeMin: 2,
        teamSizeMax: 2,
        date: "FEBRUARY 27, 2026",
        time: "10:30 AM - 04:00 PM",
        location: "AUDITORIUM",
        timing: "10:30 AM - 04:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: WORDS AH SET PANNU", duration: "45 MINS", description: "Arrange shuffled words to form correct song lyrics." },
            { id: 2, title: "ROUND 2: PIC AH CATCH PANNU", duration: "45 MINS", description: "Identify the song based on a sequence of images." },
            { id: 3, title: "ROUND 3: LYRICS AH PADI", duration: "30 MINS", description: "Fill in the missing lyrics within 30 seconds." }
        ],
        rules: [
            "Squad of 2 operatives required",
            "Pre-deployment registration mandatory before entry",
            "Score-based qualification across all rounds",
            "ROUND 1 — WORDS AH SET PANNU: Arena — Frequency Scrambler. Mission — Reconstruct the shuffled words to form the correct song lyrics before time runs out.",
            "ROUND 2 — PIC AH CATCH PANNU: Arena — Visual Cipher Terminal. Mission — Identify the song from a sequence of encoded images and lock in your answer.",
            "ROUND 3 — LYRICS AH PADI: Arena — Lyric Decryption Zone. Mission — Synchronize the missing lyrics within a 30-second temporal lock. Exceeding the window results in mission failure."
        ],
        image: "/Events_image/start music.webp",
        ctaText: "DROP THE BEAT"
    },
    {
        id: "lubberpandhu",
        name: "Lubber Pandhu",
        subtitle: "STREET CRICKET SHOWDOWN",
        category: "Non-Technical",
        description: "Knockout cricket tournament. R1 winners qualify for Semi-Finals.",
        teamSizeMin: 4,
        teamSizeMax: 5,
        date: "FEBRUARY 27, 2026",
        time: "11:00 AM - 03:00 PM",
        location: "SPORTS GROUND",
        timing: "11:00 AM - 03:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: KNOCKOUTS", duration: "2 HOURS", description: "Direct elimination matches." },
            { id: 2, title: "ROUND 2: SEMI-FINALS", duration: "1 HOUR", description: "Winning teams compete for the final spot." },
            { id: 3, title: "ROUND 3: THE FINAL", duration: "1 HOUR", description: "Championship match." }
        ],
        rules: [
            "Squad deployment: 4–5 operatives per unit",
            "Equipment restrictions: No grenades or skill-based weaponry",
            "Eliminator protocol: Defeated squads are permanently removed from the operation",
            "ROUND 1 — KNOCKOUTS: Arena — Combat Zone Alpha. Mission — Eliminate opposing squads in direct confrontation matches. Defeated units receive immediate Eliminator status.",
            "ROUND 2 — SEMI-FINALS: Arena — Combat Zone Bravo. Mission — Surviving squads advance to high-stakes matches. Secure your position in the final deployment.",
            "ROUND 3 — THE FINAL: Arena — Championship Battleground. Mission — Last two squads clash for total supremacy. No second chances."
        ],
        image: "/Events_image/lubber pandhu.webp",
        ctaText: "JOIN SQUAD"
    },
    {
        id: "esports",
        name: "E-Sports",
        subtitle: "VIRTUAL BATTLEGROUND",
        category: "Non-Technical",
        description: "A competitive gaming event featuring Battle Royale and CS matches.",
        teamSizeMin: 1,
        teamSizeMax: 4,
        date: "FEBRUARY 27, 2026",
        time: "10:00 AM - 4:00 PM",
        location: "COMPUTER CENTRE",
        timing: "10:00 AM - 4:00 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: QUALIFIERS", duration: "2 HOURS", description: "Open lobby matches to determine top seeds." },
            { id: 2, title: "ROUND 2: ELIMINATION", duration: "2 HOURS", description: "Head-to-head knockout rounds." },
            { id: 3, title: "ROUND 3: FINALS", duration: "1 HOUR", description: "Best of 3 series for the championship." }
        ],
        rules: [
            "Squad configuration: Solo or up to 4 operatives",
            "Personal hardware deployment required — no shared terminals",
            "Supported combat platforms: BGMI / Valorant",
            "ROUND 1 — QUALIFIERS: Arena — Open Lobby Warzone. Mission — Engage in mass deployment matches to secure top-seed ranking among all participating squads.",
            "ROUND 2 — ELIMINATION: Arena — Head-to-Head Combat Zone. Mission — Execute direct knockout engagements. Only victorious squads advance to the final theatre.",
            "ROUND 3 — FINALS: Arena — Championship Server. Mission — Dominate a best-of-3 series to claim the ultimate victory. No respawns."
        ],
        image: "/Events_image/esports.webp",
        ctaText: "ENTER LOBBY"
    },
    {
        id: "clashoftalents",
        name: "Clash of Talents",
        subtitle: "SHOWCASE YOUR SPARK",
        category: "Non-Technical",
        description: "A movie-based event with quiz and song & dialogue challenges.",
        teamSizeMin: 1,
        teamSizeMax: 3,
        date: "FEBRUARY 27, 2026",
        time: "2:00 PM - 4:00 PM",
        location: "OPEN AIR THEATRE",
        timing: "2:00 PM - 4:00 PM",
        timeSlot: "afternoon",
        rounds: [
            { id: 1, title: "ROUND 1: CINE QUIZ", duration: "45 MINS", description: "Trivia round on movies and pop culture." },
            { id: 2, title: "ROUND 2: PERFORMANCE", duration: "1 HOUR", description: "Song, dialogue delivery, or acting performance." }
        ],
        rules: [
            "Squad configuration: Solo or team of up to 3",
            "Transmission window: 5-minute performance limit per squad",
            "Props and auxiliary equipment authorized",
            "ROUND 1 — CINE QUIZ: Arena — Cinematic Intelligence Terminal. Mission — Decrypt film trivia and pop-culture data transmissions. Accuracy determines qualification.",
            "ROUND 2 — PERFORMANCE: Arena — Silent Communication Chamber. Mission — Execute song delivery, dialogue transmission, or mime-based encoding. Lip movement and miming classified as silent communication protocols."
        ],
        image: "/Events_image/clash of talents.webp",
        ctaText: "SHOW TIME"
    },
    {
        id: "iplauction",
        name: "IPL Auction",
        subtitle: "BID. BUILD. WIN.",
        category: "Non-Technical",
        description: "Build your dream IPL team within a budget and score the highest points.",
        teamSizeMin: 1,
        teamSizeMax: 3,
        date: "FEBRUARY 27, 2026",
        time: "11:00 AM - 03:30 PM",
        location: "SEMINAR HALL B",
        timing: "11:00 AM - 03:30 PM",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: BUDGET ALLOCATION", duration: "30 MINS", description: "Plan your strategy and budget." },
            { id: 2, title: "ROUND 2: THE AUCTION", duration: "3 HOURS", description: "Live bidding for players." }
        ],
        rules: [
            "Squad configuration: Solo or team of up to 3 strategists",
            "Budgetary constraint: Acquire 11 operatives (max 4 foreign assets)",
            "Mandatory squad composition: 4 BAT / 4 BOWL / 2 AR / 1 WK",
            "Player credit matrix: Each operative carries a credit rating out of 10",
            "Victory condition: Squad with highest cumulative credit score wins",
            "ROUND 1 — BUDGET ALLOCATION: Arena — Strategic Command Center. Mission — Analyze the player pool, allocate resources, and formulate your acquisition strategy within the 30-minute planning window.",
            "ROUND 2 — THE AUCTION: Arena — Live Auction Floor. Mission — Outbid rival franchises in real-time to assemble the highest-rated squad. Deploy funds with precision — overspending results in mission failure."
        ],
        image: "/Events_image/ipl auction.webp",
        ctaText: "START BIDDING"
    },
    // Breakout Events
    {
        id: "carrom",
        name: "Carrom 2.0",
        subtitle: "STRIKE & POCKET",
        category: "Breakout",
        description: "A knockout carrom tournament testing accuracy and strategy.",
        teamSizeMin: 2,
        teamSizeMax: 2,
        date: "FEBRUARY 27, 2026",
        time: "Flexible",
        location: "INDOOR GAMES HALL",
        timing: "Flexible",
        timeSlot: "flexible",
        rounds: [
            { id: 1, title: "ROUND 1: KNOCKOUT", duration: "VARIES", description: "Single elimination match." },
            { id: 2, title: "ROUND 2: FINALS", duration: "VARIES", description: "Championship match between the last two standing squads." }
        ],
        rules: [
            "Squad integrity: Doubles only — 2 fixed operatives per unit",
            "Silent operation protocol: No coaching or external communication during play",
            "Field commander directive: Umpire decision is final and non-negotiable",
            "5-minute reporting window: Squads must report to the board within 5 minutes of being called",
            "ROUND 1 — KNOCKOUT: Arena — Board Rotation Terminal. Mission — Navigate a single-elimination bracket. Execute precision strikes and pocket targets before your opponent. One loss and your operation is terminated.",
            "ROUND 2 — FINALS: Arena — Championship Board. Mission — The last two squads face off in the ultimate showdown. Pocket all targets with surgical precision to claim total supremacy."
        ],
        image: "/Events_image/carrom.20.jpeg",
        ctaText: "PLAY NOW"
    },
    {
        id: "vaangapazhagalam",
        name: "Vaanga Pazhagalam",
        subtitle: "CONNECT & CONQUER",
        category: "Breakout",
        description: "A fun team event that builds bonding through interactive challenges.",
        teamSizeMin: 4,
        teamSizeMax: 4,
        date: "FEBRUARY 27, 2026",
        time: "Flexible timing",
        location: "COURTYARD",
        timing: "Flexible timing",
        timeSlot: "fullday",
        rounds: [
            { id: 1, title: "ROUND 1: STICK TOGETHER", duration: "20 MINS", description: "Team coordination challenge: Don't drop the object." },
            { id: 2, title: "ROUND 2: FOLLOW THE BEAT", duration: "20 MINS", description: "Sync your dance steps with the team." },
            { id: 3, title: "ROUND 3: SQUID GAME RUN", duration: "20 MINS", description: "Three-legged race to the finish line." }
        ],
        rules: [
            "Squad integrity: 4 strangers — operatives must not have prior acquaintance",
            "Field commander directive: Umpire decision is final and absolute",
            "Sensory deprivation: Audio-visual signal scrambling may be active during select rounds",
            "ROUND 1 — STICK TOGETHER: Arena — Object Stabilization Zone. Mission — Synchronize with your squad to transport the object without dropping it. Any contact loss results in penalty.",
            "ROUND 2 — FOLLOW THE BEAT: Arena — Kinetic Sync Chamber. Mission — Replicate the dance sequence with full squad coordination. Accuracy determines advancement.",
            "ROUND 3 — SQUID GAME RUN: Arena — Mechanical Link Course. Mission — Navigate the course with legs tethered via mechanical link constraint. First squad to cross the finish line claims victory."
        ],
        image: "/Events_image/vangaaa.jpeg",
        ctaText: "JOIN FUN"
    },
];
