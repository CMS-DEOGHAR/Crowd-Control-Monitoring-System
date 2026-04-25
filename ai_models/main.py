import cv2
import supervision as sv
from ultralytics import YOLO


# ----------------------------------------------------
# 1. MODEL INITIALIZATION
# ----------------------------------------------------
model = YOLO("yolov10n.pt")


# ----------------------------------------------------
# 2. VIDEO SOURCE SETUP
# ----------------------------------------------------
video_path = "sample_crowd.mp4"
video_info = sv.VideoInfo.from_video_path(video_path)
generator  = sv.get_video_frames_generator(video_path)

width  = video_info.width
height = video_info.height


# ----------------------------------------------------
# 3. TRACKER SETUP (ByteTrack)
# Assigns a unique persistent ID to each detected person
# across frames to enable accurate entry/exit counting.
# ----------------------------------------------------
tracker = sv.ByteTrack()


# ----------------------------------------------------
# 4. VIRTUAL GATE / COUNTING LINE SETUP
# A horizontal line drawn at the vertical center of the
# frame. Crossings in each direction are counted separately.
# ----------------------------------------------------
START     = sv.Point(0, height // 2)
END       = sv.Point(width, height // 2)
line_zone = sv.LineZone(start=START, end=END)


# ----------------------------------------------------
# 5. ANNOTATOR SETUP
# ----------------------------------------------------
box_annotator       = sv.BoxAnnotator()
label_annotator     = sv.LabelAnnotator()
line_zone_annotator = sv.LineZoneAnnotator(
    thickness=4,
    text_thickness=2,
    text_scale=1.5
)


# ----------------------------------------------------
# 6. MAIN PROCESSING LOOP
# ----------------------------------------------------
print("Processing video feed... Press 'q' to quit.")

for frame in generator:
    # A. Run person detection (class 0 = person in COCO)
    results    = model(frame)[0]
    detections = sv.Detections.from_ultralytics(results)
    detections = detections[detections.class_id == 0]

    # B. Update tracker with current detections
    detections = tracker.update_with_detections(detections)

    # C. Update line crossing counts
    crossed_in, crossed_out = line_zone.trigger(detections)

    # D. Build per-detection labels using tracker IDs
    labels = [f"#{tracker_id}" for tracker_id in detections.tracker_id]

    # E. Draw bounding boxes, labels, and counting line
    annotated_frame = frame.copy()
    annotated_frame = box_annotator.annotate(scene=annotated_frame, detections=detections)
    annotated_frame = label_annotator.annotate(scene=annotated_frame, detections=detections, labels=labels)
    annotated_frame = line_zone_annotator.annotate(annotated_frame, line_counter=line_zone)

    cv2.imshow("Deoghar CMS — Live Crowd Monitor", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()
