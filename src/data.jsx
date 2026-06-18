// ===== data.jsx =====
// ============== Data ==============

const ABOUT = {
  name: "Yajat Mittal",
  blurb:
  <>
      I’m an 18-year-old working at the intersection of  <b>computer vision</b>, <b>machine learning</b>, and <b>real-world applications</b>.

 Incoming   <a href="https://uwaterloo.ca/computer-science/" target="_blank" rel="noreferrer"><b><span className="nobreak"><img className="inline-logo coin" src="assets/icons/waterloo.png" alt="" />CS</span> @ University of Waterloo</b></a>, and currently a contributor at   <a href="https://blog.roboflow.com/author/yajat/" target="_blank" rel="noreferrer"><span className="nobreak"><img className="inline-logo round" src="assets/icons/roboflow.png" alt="" />Roboflow</span></a>, writing technical tutorials on computer vision projects. 
    </>,

  skills: [
  "Python", "C++", "Swift",
  "HTML / CSS", "JavaScript",
  "Computer Vision", "Machine Learning",
  "iOS Development", "RF-DETR", "YOLO",
  "Jupyter", "Roboflow"]

};

const EXPERIENCE = [
{
  role: "Contributing Writer",
  company: "Roboflow",
  type: "Computer Vision",
  period: "May 2026 — Present",
  current: true,
  blurb: "Writing technical tutorials and articles on computer vision.",
  logo: { type: "img", src: "assets/icons/roboflow.png" },
  href: "https://blog.roboflow.com/author/contributing-writer/"
},
{
  role: "Peel Student Advisory Committee Member",
  company: "Peel District School Board",
  type: "On-Call",
  period: "Nov 2024 — May 2026",
  blurb: "Organizing STEAM initiatives across Peel — competitions and hackathons like VEX IQ PDSB 2025.",
  logo: { type: "img", src: "assets/icons/peel.jpeg", round: true }
}];


const PROJECTS = [
{
  name: "SnackTrack",
  desc: "A real-time snack tracker that rewards healthy eating. MediaPipe finds your face and mouth while a custom-trained Roboflow model spots apples and cookies on the live webcam feed — eat an apple to gain points, a cookie to lose them.",
  tagline: "Real-time snack detection · Roboflow + Flask",
  tags: ["Python", "Flask", "OpenCV", "Roboflow"],
  href: "https://github.com/YajatMittal/SnackTrack",
  cover: { video: "assets/projects/videos/SnackTrack.mp4", poster: "assets/projects/images/snacktrack.jpg", crop: { scale: 1.12, originY: "34%" } }
},
{
  name: "Memoria",
  desc: "An AI-powered memory-support tool built to help Alzheimer's patients recognize loved ones and hold onto daily context — pairing computer vision with a calm, accessible interface.",
  tagline: "AI memory support · Alzheimer's care",
  tags: ["AI", "Computer Vision", "Healthcare"],
  href: "https://github.com/YajatMittal/Memoria",
  cover: { img: "assets/projects/images/memoria.png" }
},
{
  name: "Tabula",
  desc: "An end-to-end pipeline that turns a single top-down photo of a breadboard into ready-to-fabricate PCB files. OpenCV reconstructs the grid, a Roboflow model plus Gemini identify components, and KiCad schematics are synthesized and auto-routed.",
  tagline: "Breadboard photo → PCB · EurekaHacks",
  tags: ["Python", "Computer Vision", "Gemini", "React"],
  href: "https://github.com/YajatMittal/Tabula",
  cover: { video: "assets/projects/videos/tabula.mp4", poster: "assets/projects/images/tabula.jpg", crop: { scale: 1.05, originY: "100%" } }
},
{
  name: "Flappy Fitness",
  desc: "A camera-controlled Flappy Bird where your workout is the controller. MediaPipe pose estimation tracks squats, jumping jacks, and toe touches, streaming reps over SocketIO to drive the bird in real time.",
  tagline: "Pose-controlled Flappy Bird · StarterHacks",
  tags: ["Python", "MediaPipe", "PyGame", "SocketIO"],
  href: "https://github.com/YajatMittal/Flappy-Fitness",
  cover: { img: "assets/projects/images/flappybird.png" }
},
{
  name: "WeatherSphere",
  desc: "An iOS weather app built across my Swift learning journey — CoreLocation, OpenWeather API, animated UI states. Polished native UX from scratch.",
  tagline: "Native iOS weather app · Swift",
  tags: ["Swift", "iOS", "UIKit", "API"],
  href: "https://github.com/YajatMittal/WeatherSphere",
  cover: { video: "assets/projects/videos/WeatherSphere.mp4", poster: "assets/projects/images/weathersphere.jpg" }
},
{
  name: "Skin Cancer Detection",
  desc: "A CNN classifier for dermoscopic images that flags potentially malignant lesions. Image preprocessing, augmentation, and a custom train loop in Python.",
  tagline: "CNN lesion classifier · medical imaging",
  tags: ["Python", "Deep Learning", "Medical Imaging"],
  href: "https://github.com/YajatMittal/Skin-Cancer-Detection",
  cover: { img: "assets/projects/images/skin-cancer.png" }
}];

// Which projects appear in the "featured" strip on the home page, in this order.
const FEATURED_NAMES = ["SnackTrack", "Tabula", "Memoria"];


const BLOG = [
{
  title: "Give My Agent Eyes: Build a No-Code Vision Agent",
  desc: "How to give an AI agent sight: pairing an object-detection model with a multimodal LLM in a no-code Roboflow workflow so it can perceive, reason about, and act on what it sees.",
  date: "June 11, 2026",
  tag: "Computer Vision",
  href: "https://blog.roboflow.com/give-my-agent-eyes/",
  cover: "assets/blog/give-my-agent-eyes.png"
},
{
  title: "Automate PPE Detection with RF-DETR & Roboflow",
  desc: "How to build a real-time worker-safety pipeline: RF-DETR + ByteTrack + a custom Python block to live-count safe vs. unsafe workers on construction footage.",
  date: "May 18, 2026",
  tag: "Computer Vision",
  href: "https://blog.roboflow.com/ppe-detection/",
  cover: "assets/blog/ppe-detection.png"
}];


const LINKS = {
  github: "https://github.com/YajatMittal",
  linkedin: "https://www.linkedin.com/in/yajat-mittal/",
  email: "mailto:yajat.mittal@uwaterloo.ca",
  resume: "https://drive.google.com/file/d/19ouDkG2wQFw77IC9h8b9BZ9v6bjJYl47/view?usp=sharing"
};

Object.assign(window, { ABOUT, EXPERIENCE, PROJECTS, BLOG, LINKS });
