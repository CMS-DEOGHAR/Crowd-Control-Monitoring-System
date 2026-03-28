# 🛕 Crowd Control Monitoring System (Deoghar CMS)

![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Version](https://img.shields.io/badge/Version-1.0-blue)

## 📌 Project Overview
Large gatherings at religious sites like the Deoghar Temple pose serious safety risks, including sudden overcrowding and stampedes. Manual crowd management is often reactive. 

**Deoghar CMS** is a production-grade, computer vision-based system designed to estimate live crowd density using RTSP camera feeds, compute real-time entry/exit occupancy, and trigger proactive alerts to prevent dangerous situations.

## 🚀 Key Features
* **Real-time Entry/Exit Tracking:** Accurate counting using tripwires and multi-object tracking.
* **Dense Crowd Heatmaps:** Density estimation for highly occluded areas (like the Garbhagriha) where individual detection fails.
* **Proactive Alert System:** Threshold-based visual and auditory warnings for authorities.
* **Live Authority Dashboard:** A low-latency web interface streaming live processed video and real-time analytics.

## 💻 Tech Stack (Modern Architecture)
We have upgraded from traditional textbook models to industry-standard real-time processing tools:

* **Core AI & Vision:** YOLOv10 (Fast Person Detection), ByteTrack (Multi-Object Tracking for occlusion), FIDT (Focal Inverse Distance Transform for Density Estimation).
* **Backend Processing:** FastAPI (High-speed asynchronous Python backend) & WebRTC (Low-latency video streaming).
* **Frontend UI:** React.js powered by Vite, Tailwind CSS, Node.js + Socket.io for real-time WebSocket communication.
* **Datasets Used:** ShanghaiTech Crowd Counting, UCF-QNRF.

## ⚙️ System Architecture 

1. **Camera Nodes:** RTSP streams capture live footage.
2. **AI Inference Engine (FastAPI):** Frames are pushed through YOLOv10 & ByteTrack for entry/exit gates, and FIDT for main halls.
3. **Data Layer:** Occupancy metrics are calculated and anomalies are flagged.
4. **Client Interface:** Node.js pushes updates via WebSockets to the React/Vite Dashboard.

## 👥 The Team (CMS-DEOGHAR)
* **Amit Chanchal** - AI Pipeline, Model Integration & Lead
* **Anupriya** - Backend Setup & Infrastructure
* **Minu** - Frontend Development & Dashboard UI
* **Neel** - Dataset Management & Testing

---
*Developed for AI Class Assignment & Real-World Application.*
