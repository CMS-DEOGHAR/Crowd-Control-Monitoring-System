"""
Smoke test for YOLOv10 model loading and inference.
Run this to verify the model file and dependencies are working correctly.
"""

import os
from ultralytics import YOLO


def main() -> None:
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "yolov10n.pt")

    if not os.path.exists(model_path):
        print(f"ERROR: Model file not found at '{model_path}'.")
        return

    print("Loading YOLOv10n model...")
    model = YOLO(model_path)
    print(f"Model loaded successfully: {model_path}")
    print("YOLO smoke test passed.")


if __name__ == "__main__":
    main()
