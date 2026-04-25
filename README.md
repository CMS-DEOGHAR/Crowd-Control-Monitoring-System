# Crowd Control Monitoring System — Deoghar CMS

![Status](https://img.shields.io/badge/Status-In%20Development-orange)
![Version](https://img.shields.io/badge/Version-1.0-blue)
[![Live Dashboard](https://img.shields.io/badge/Live%20Dashboard-Visit%20Now-brightgreen?style=flat&logo=vercel)](https://cms-mu-blush.vercel.app)

## 🌐 Live Dashboard
**[https://cms-mu-blush.vercel.app](https://cms-mu-blush.vercel.app)**
> Deployed on Vercel — Click to open the live Admin Command Center.

## Project Overview

Large gatherings at religious sites like the Deoghar Temple pose serious safety risks, including sudden overcrowding and stampedes. Manual crowd management is often reactive and insufficient at scale.

**Deoghar CMS** is a production-grade, computer vision-based system designed to estimate live crowd density using RTSP camera feeds, compute real-time entry/exit occupancy, and trigger proactive alerts to prevent dangerous situations.

---

## Key Features

- **Real-time Entry/Exit Tracking** — Accurate person counting using virtual tripwires and multi-object tracking.
- **Dense Crowd Density Estimation** — Heatmap-based density estimation for highly occluded areas (e.g., the Garbhagriha) where individual detection fails.
- **Proactive Alert System** — Threshold-based visual and auditory warnings for on-ground authorities.
- **Live Authority Dashboard** — Low-latency web interface streaming processed video and real-time analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Person Detection | YOLOv10 (fast, lightweight) |
| Multi-Object Tracking | ByteTrack (occlusion-robust) |
| Density Estimation | CSRNet (trained on ShanghaiTech) |
| Backend API | FastAPI + Uvicorn |
| Real-time Streaming | WebRTC / Socket.io |
| Frontend Dashboard | React.js + Vite + Tailwind CSS |
| Datasets | ShanghaiTech Part B, UCF-QNRF |

---

## System Architecture

```
Camera Nodes (RTSP)
        │
        ▼
AI Inference Engine (FastAPI)
  ├── YOLOv10 + ByteTrack  →  Entry/Exit Gate Counting
  └── CSRNet               →  Density Heatmap (main halls)
        │
        ▼
Data Layer (occupancy metrics, anomaly detection)
        │
        ▼
React Dashboard (WebSocket live updates)
```

---

## Project Structure

```
Crowd-Control-Monitoring-System/
├── ai_models/
│   ├── main.py                # Live video processing pipeline
│   ├── evaluate_yolo.py       # Stage 1: YOLOv10 baseline evaluation
│   ├── evaluate_csrnet.py     # Stage 2: CSRNet density estimation evaluation
│   ├── yolo_test.py           # YOLO smoke test
│   ├── yolov10n.pt            # YOLOv10 nano model weights
│   ├── partBmodel_best.pth.tar # CSRNet pre-trained weights (Part B)
│   ├── stage1_metrics.txt     # Stage 1 evaluation results
│   ├── stage2_metrics.txt     # Stage 2 evaluation results (generated)
│   ├── sample_crowd.mp4       # Sample video for local testing
│   ├── part_B/                # ShanghaiTech Part B test dataset
│   │   └── test_data/
│   │       ├── images/        # 316 test images (.jpg)
│   │       └── ground-truth/  # 316 ground truth files (.mat)
│   └── requirements.txt
├── backend/
│   └── requirements.txt       # FastAPI backend dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

---

## Getting Started

### AI Models

```bash
cd ai_models
.\venv\Scripts\activate          # Windows
# source venv/bin/activate       # Linux/macOS

# Run live video pipeline
python main.py

# Run Stage 1 evaluation (YOLOv10 baseline)
python evaluate_yolo.py

# Run Stage 2 evaluation (CSRNet density estimation)
python evaluate_csrnet.py
```

//commands
<!-- pip install ultralytics opencv-python supervision torch torchvision numpy scipy Pillow
python main.py
python optical_flow.py
python demo_heatmap.py -->
### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Evaluation Results

| Stage | Model | MAE | MSE |
|---|---|---|---|
| Stage 1 | YOLOv10 (baseline) | 111.80 | 21759.96 |
| Stage 2 | CSRNet (density estimation) | 89.35 | 13409.86 |

---

## Team

| Member | Role |
|---|---|
| Amit Chanchal | AI Pipeline, Model Integration & Lead |
| Anupriya | Backend Setup & Infrastructure |
| Minu | Frontend Development & Dashboard UI |
| Neel | Dataset Management & Testing |

---

*Developed for AI Class Assignment & Real-World Application.*
