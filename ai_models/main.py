import cv2
from ultralytics import YOLO
import supervision as sv

# 1. Load YOLO model ('nano' version is best for CPU)
model = YOLO("yolov10n.pt")

# 2. Set up video path
video_path = "sample_crowd.mp4"  # Write your exact video file name here
video_info = sv.VideoInfo.from_video_path(video_path)
generator = sv.get_video_frames_generator(video_path)

# Dynamically read the original video width and height
width = video_info.width
height = video_info.height

# 3. Tracker Setup (ByteTrack)
# This gives each detected person a unique ID (like #1, #2, #3)
tracker = sv.ByteTrack()

# 4. Virtual Gate / Line Setup (Dynamic ROI)
# The line is always drawn at the exact center of the video, from left to right
START = sv.Point(0, height // 2)
END = sv.Point(width, height // 2)
line_zone = sv.LineZone(start=START, end=END)

# 5. Annotators setup (tools to draw boxes and line)
box_annotator = sv.BoxAnnotator()
label_annotator = sv.LabelAnnotator()

# Make the line thicker and text larger for better visibility
line_zone_annotator = sv.LineZoneAnnotator(
    thickness=4, 
    text_thickness=2, 
    text_scale=1.5
)

print("Processing Recorded Video on CPU... Press 'q' to stop.")

# Process each frame (image) of the video
for frame in generator:
    # A. AI Detection
    results = model(frame)[0]
    detections = sv.Detections.from_ultralytics(results)
    
    # Keep only the 'person' class (person class ID is 0 in COCO dataset)
    detections = detections[detections.class_id == 0]
    
    # B. Tracking Update
    detections = tracker.update_with_detections(detections)
    
    # C. Line Counting Update
    crossed_in, crossed_out = line_zone.trigger(detections)
    
    # D. Create labels (e.g., "#5")
    labels = [
        f"#{tracker_id}"
        for tracker_id in detections.tracker_id
    ]

    # E. Draw annotations on screen
    annotated_frame = frame.copy()
    annotated_frame = box_annotator.annotate(scene=annotated_frame, detections=detections)
    annotated_frame = label_annotator.annotate(scene=annotated_frame, detections=detections, labels=labels)
    
    # Draw LineZone and its counter
    annotated_frame = line_zone_annotator.annotate(
        annotated_frame, 
        line_counter=line_zone
    )

    # Show output
    cv2.imshow("Deoghar CMS - Offline Video Testing", annotated_frame)

    # Break loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()