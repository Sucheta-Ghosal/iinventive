import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from './models/Project.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const dummyData = [
  {
    title: "AI-Driven Non-Invasive Glucose Monitor",
    slug: "ai-driven-non-invasive-glucose-monitor",
    type: "Health Care",
    affiliation: "GlucoSense Technologies",
    description: "The AI-Driven Non-Invasive Glucose Monitor represents a revolutionary step forward in diabetes management. By utilizing advanced multi-wavelength near-infrared spectroscopy, the device can accurately measure glucose concentrations through the skin without relying on painful and invasive pinpricks. The core technology leverages a proprietary machine learning algorithm trained on millions of data points to filter out noise from variations in skin tone, temperature, and hydration levels. Designed to be worn continuously, the device pairs seamlessly with iOS and Android applications, providing real-time alerts, predictive trend analysis, and comprehensive reports that can be directly shared with healthcare providers. This innovation is expected to significantly improve compliance and quality of life for millions of individuals living with diabetes globally.",
    picture: [
      "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb2?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "contact@glucosense.com", phone: "+91-9876543210" }
  },
  {
    title: "Tele-Robotic Surgical System for Rural Areas",
    slug: "tele-robotic-surgical-system-for-rural-areas",
    type: "Health Care",
    affiliation: "IIT KHARAGPUR",
    description: "Addressing the severe shortage of specialized surgical care in rural areas, this tele-robotic surgical system enables top-tier surgeons located in metropolitan centers to perform complex procedures remotely. The system integrates blazing-fast 5G low-latency data transmission, haptic feedback mechanisms that replicate the sensation of tissue resistance, and highly precise articulating robotic arms. Preliminary clinical trials demonstrate a 99.8% precision parity with in-person surgeries. The deployment of this unit in remote clinics drastically reduces patient travel times and mortality rates in emergency trauma scenarios. Furthermore, the base module can operate during network dropouts using an integrated AI failsafe that securely holds position until the connection is restored.",
    picture: [
      "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "innovations@iitkgp.ac.in", phone: "+91-8765432109" }
  },
  {
    title: "Self-Healing Biodegradable Polymers",
    slug: "self-healing-biodegradable-polymers",
    type: "Materials Science",
    affiliation: "IIT(BHU) VARANASI",
    description: "Our Self-Healing Biodegradable Polymer is engineered to tackle the global plastic pollution crisis head-on. Embedded within the polymer matrix are specialized microcapsules containing an eco-friendly healing agent. When the material experiences structural stress or micro-cracking, these capsules rupture, instantly polymerizing to seal the damage and restore the material to 95% of its original strength. Beyond its durability, the polymer's chemical architecture ensures it is highly susceptible to naturally occurring marine enzymes. If the material enters an oceanic environment, it safely completely biodegrades within 180 days, leaving zero toxic microplastics behind.",
    picture: [
      "https://images.unsplash.com/photo-1618042164219-62c820f10723?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "materials@iitbhu.ac.in", phone: "+91-7654321098" }
  },
  {
    title: "Graphene-infused Lightweight Armor",
    slug: "graphene-infused-lightweight-armor",
    type: "Materials Science",
    affiliation: "AeroShield Dynamics",
    description: "AeroShield Dynamics has pioneered a manufacturing process to consistently intercalate single-layer graphene into traditional ultra-high-molecular-weight polyethylene (UHMWPE) fabrics. The result is a next-generation composite armor that is 40% lighter than standard Kevlar equivalents while providing a 60% increase in kinetic energy dissipation. By leveraging the extreme tensile strength of carbon-carbon bonds, the armor diffuses point-impact forces across a wider surface area, significantly reducing back-face deformation and blunt force trauma to the wearer. This breakthrough translates into increased mobility, lower fatigue, and enhanced survivability for law enforcement and military personnel.",
    picture: [
      "https://images.unsplash.com/photo-1544383835-bca2bc6f5ea3?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "info@aeroshield.com", phone: "+91-6543210987" }
  },
  {
    title: "Seismic Prediction using Deep Underground Sensors",
    slug: "seismic-prediction-using-deep-underground-sensors",
    type: "Earth Sciences",
    affiliation: "IIT(ISM) DHANBAD",
    description: "Earthquake early warning systems currently rely on detecting P-waves after a rupture has already occurred. Our innovation deploys ultra-sensitive quantum gravimeters and magnetic anomaly sensors deep underground, adjacent to active fault lines. By continuously monitoring subtle shifts in the localized gravitational field and electromagnetism that precede rock fracturing, this AI-powered neural sensor network can deliver predictive alerts up to 10 to 15 seconds earlier than traditional seismometers. In urban environments, these critical extra seconds drastically improve the viability of automated shut-offs for gas lines, rapid braking of transit systems, and evacuation protocols.",
    picture: [
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "earth@iitism.ac.in", phone: "+91-5432109876" }
  },
  {
    title: "Ocean Microplastic Autonomous Harvester",
    slug: "ocean-microplastic-autonomous-harvester",
    type: "Earth Sciences",
    affiliation: "ClearSeas Initiative",
    description: "The Autonomous Harvester is an aquatic surface drone specifically designed to continuously sweep open water columns for microplastic accumulation. Fully powered by high-efficiency solar panels and propelled by specialized quiet electric motors, the drone can remain at sea indefinitely. Combining multispectral imaging cameras and machine learning, it actively hunts for concentrated plastic vortices. Once located, it utilizes a proprietary micro-mesh dynamic filtration system that safely extracts polymer debris while allowing plankton and small marine life to pass through unharmed. A fleet of 100 drones can successfully process and clean up to 2 million gallons of seawater daily.",
    picture: [
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1582967280803-059e79d5dfad?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "hello@clearseas.org", phone: "+91-4321098765" }
  },
  {
    title: "Federated Learning for Regional Dialect Translation",
    slug: "federated-learning-for-regional-dialect-translation",
    type: "Artificial Intelligence",
    affiliation: "IIT PATNA",
    description: "India boasts hundreds of distinct regional languages and dialects that remain severely underrepresented in modern natural language processing models. Our platform solves this via Edge-Federated Learning. Instead of uploading vast amounts of sensitive audio to a central server, the AI models are trained locally on users' smartphones. Only the updated mathematical weights are securely synced back to the global model. This inherently preserves user privacy, massively reduces bandwidth costs in rural areas, and successfully builds highly accurate real-time speech-to-text and translation engines for dialects like Bhojpuri, Maithili, and Santhali, bridging the digital divide.",
    picture: [
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "ai_research@iitp.ac.in", phone: "+91-3210987654" }
  },
  {
    title: "Autonomous Drone Swarms for Precision Agriculture",
    slug: "autonomous-drone-swarms-for-precision-agriculture",
    type: "Artificial Intelligence",
    affiliation: "AgriVision AI",
    description: "AgriVision AI modernizes large-scale farming by replacing broad-spectrum chemical spraying with surgical, AI-directed intervention. Utilizing a coordinated swarm of low-cost aerial drones, the system conducts daily topographical and multispectral scans of massive crop fields. Deep learning algorithms immediately process the feed to detect early signs of blight, nutrient deficiency, or pest infestations down to the individual plant level. Identified targets are then instantly mapped out for the payload drones, which deploy micro-doses of targeted treatments exclusively where needed. This approach reduces overall chemical pesticide usage by up to 80% while significantly boosting crop yields.",
    picture: [
      "https://images.unsplash.com/photo-1586771107445-d3af31f237ef?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1559884762-b2ccb3cfc234?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "support@agrivision.ai", phone: "+91-2109876543" }
  },
  {
    title: "Ultra-Low Power RISC-V IoT Processors",
    slug: "ultra-low-power-risc-v-iot-processors",
    type: "Semiconductor Technology & Chip Design",
    affiliation: "IIT BHUBANESWAR",
    description: "As the Internet of Things (IoT) expands universally, power efficiency is paramount. Our team has engineered a fully custom, heavily optimized RISC-V instruction set architecture built from the ground up to minimize leakage current and dynamic power scaling. Utilizing a specialized 22nm FD-SOI fabrication node, the processor enters deep sleep states within microseconds and utilizes asynchronous logic gates to prevent clock tree power waste. Benchmarks verify a 60% reduction in battery consumption compared to modern Cortex-M equivalents, enabling smart home sensors and wearables to last years on a single coin-cell battery without sacrificing edge-compute performance.",
    picture: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "vlsi@iitbbs.ac.in", phone: "+91-1098765432" }
  },
  {
    title: "Photonic Neuromorphic Chip",
    slug: "photonic-neuromorphic-chip",
    type: "Semiconductor Technology & Chip Design",
    affiliation: "LightCore Semiconductors",
    description: "LightCore is revolutionizing AI hardware accelerators by transitioning from traditional electronic transistors to integrated silicon photonics. In our neuromorphic chip, information is transmitted and modulated using multi-wavelength laser light passing through microscopic optical waveguides. By essentially performing complex matrix multiplications in the analog optical domain, the chip bypasses the standard von Neumann bus bottleneck entirely. It calculates neural network inferences simultaneously across thousands of channels continuously, functioning millions of times faster than standard GPUs while consuming a fraction of the thermal energy, paving the way for instantaneous local AI processing.",
    picture: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800"
    ],
    contact: { email: "tech@lightcore.io", phone: "+91-9988776655" }
  }
];

const importData = async () => {
  try {
    await Project.deleteMany();
    await Project.insertMany(dummyData);
    console.log('Dummy Data Imported to MongoDB Successfully! New Schema OK!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding data: ${error.message}`);
    process.exit(1);
  }
};

importData();
