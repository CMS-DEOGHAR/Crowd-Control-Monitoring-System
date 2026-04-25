import cv2
import numpy as np

# 1. Video load karo
video_path = 'sample_crowd.mp4'
cap = cv2.VideoCapture(video_path)

ret, frame1 = cap.read()
if not ret:
    print("⚠️ Error: 'sample_crowd.mp4' video nahi mili. Path check karo!")
    exit()

# 2. Pehle frame ko Grayscale (Black & White) mein convert karo
prvs = cv2.cvtColor(frame1, cv2.COLOR_BGR2GRAY)

# 3. Color map banane ke liye HSV image setup karo (Saturation Full = 255)
hsv = np.zeros_like(frame1)
hsv[..., 1] = 255 

print("🚀 Starting Optical Flow Motion Analysis... Press 'q' to stop.")

while True:
    ret, frame2 = cap.read()
    if not ret:
        print("Video khatam!")
        break

    # Naye frame ko Grayscale karo
    next_frame = cv2.cvtColor(frame2, cv2.COLOR_BGR2GRAY)

    # --------------------------------------------------------
    # 🌟 THE MAGIC ALGORITHM (Gunner Farnebäck) 🌟
    # Yeh har pixel ki movement calculate karta hai
    # --------------------------------------------------------
    flow = cv2.calcOpticalFlowFarneback(prvs, next_frame, None, 
                                        0.5, 3, 15, 3, 5, 1.2, 0)

    # Speed (Magnitude) aur Direction (Angle) nikalo
    mag, ang = cv2.cartToPolar(flow[..., 0], flow[..., 1])

    # Direction se Color decide hoga (e.g., Right=Red, Left=Blue)
    hsv[..., 0] = ang * 180 / np.pi / 2
    
    # Speed se Brightness decide hogi (Tez motion = Bright colors)
    hsv[..., 2] = cv2.normalize(mag, None, 0, 255, cv2.NORM_MINMAX)

    # HSV ko wapas BGR (Normal Colors) mein convert karo
    flow_color = cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

    # Asli video aur Color Map ko blend kar do
    result = cv2.addWeighted(frame2, 0.5, flow_color, 0.5, 0)

    # Display karo
    cv2.imshow('Group 3 - Optical Flow (Motion Tracking)', result)

    if cv2.waitKey(30) & 0xFF == ord('q'):
        break

    # Loop aage badhane ke liye purane frame ko update karo
    prvs = next_frame

cap.release()
cv2.destroyAllWindows()