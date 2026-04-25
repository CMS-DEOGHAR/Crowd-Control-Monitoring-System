import cv2
import numpy as np

# Tumhari demo video load kar rahe hain
video_path = 'sample_crowd.mp4'
cap = cv2.VideoCapture(video_path)

# Background Subtractor (Bheed ki movement pakadne ke liye)
fgbg = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=16, detectShadows=False)

print("Starting Density Heatmap Demo... Press 'q' to stop.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Video Khatam!")
        break

    # 1. Bheed ko detect karo (White mask)
    fgmask = fgbg.apply(frame)

    # 2. Gaussian Blur lagakar usko Heatmap jaisa "Cloud/Smoke" effect do
    blur = cv2.GaussianBlur(fgmask, (101, 101), 0)

    # 3. Brightness ko normalize karo
    norm_img = cv2.normalize(blur, None, 0, 255, cv2.NORM_MINMAX, dtype=cv2.CV_8U)

    # 4. Color map lagao (Jet: Blue = Khali jagah, Red = Bheed)
    heatmap = cv2.applyColorMap(norm_img, cv2.COLORMAP_JET)

    # 5. Asli video aur Heatmap ko 50-50 mix (blend) kar do
    result = cv2.addWeighted(frame, 0.6, heatmap, 0.4, 0)

    # Screen par dikhao
    cv2.imshow('Deoghar CMS - Stage 2 (Density Heatmap Demo)', result)

    # 'q' dabane par band ho jayega
    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()