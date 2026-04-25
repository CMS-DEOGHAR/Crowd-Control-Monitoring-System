import os
import scipy.io as sio
from ultralytics import YOLO


# ----------------------------------------------------
# 1. PATH SETUP
# ----------------------------------------------------
BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
TEST_IMAGES_DIR = os.path.join(BASE_DIR, "part_B", "test_data", "images")
TEST_GT_DIR     = os.path.join(BASE_DIR, "part_B", "test_data", "ground-truth")

# ----------------------------------------------------
# 2. MODEL INITIALIZATION
# ----------------------------------------------------
print("Loading YOLOv10n model...")
model = YOLO(os.path.join(BASE_DIR, "yolov10n.pt"))

mae_sum      = 0
mse_sum      = 0
total_images = 0

print("\nStarting baseline evaluation on ShanghaiTech Part B test set...")
print("-" * 60)


# ----------------------------------------------------
# 3. EVALUATION LOOP
# ----------------------------------------------------
for img_name in sorted(os.listdir(TEST_IMAGES_DIR)):
    if not img_name.endswith('.jpg'):
        continue

    img_path = os.path.join(TEST_IMAGES_DIR, img_name)
    mat_name = "GT_" + img_name.replace('.jpg', '.mat')
    mat_path = os.path.join(TEST_GT_DIR, mat_name)

    if not os.path.exists(mat_path):
        print(f"  [SKIP] Ground truth not found for: {img_name}")
        continue

    # A. Load ground truth count from .mat file
    try:
        mat          = sio.loadmat(mat_path)
        actual_count = len(mat['image_info'][0, 0][0, 0][0])
    except Exception as e:
        print(f"  [ERROR] Could not read ground truth for {img_name}: {e}")
        continue

    # B. Run YOLO inference — count only class 0 (person) detections
    results    = model(img_path, verbose=False)[0]
    yolo_count = sum(1 for box in results.boxes if int(box.cls) == 0)

    # C. Compute per-image error
    abs_err = abs(actual_count - yolo_count)
    sq_err  = abs_err ** 2

    mae_sum      += abs_err
    mse_sum      += sq_err
    total_images += 1

    print(f"  {img_name:<15} | Actual: {actual_count:>4} | Predicted: {yolo_count:>4} | Error: {abs_err:>4}")


# ----------------------------------------------------
# 4. FINAL METRICS & RESULTS
# ----------------------------------------------------
print("-" * 60)

if total_images > 0:
    mae = mae_sum / total_images
    mse = mse_sum / total_images

    print("\n" + "=" * 50)
    print("  STAGE 1 RESULTS — YOLOv10 (Baseline)")
    print("=" * 50)
    print(f"  Total Images Processed : {total_images}")
    print(f"  MAE (Mean Abs. Error)  : {mae:.4f}")
    print(f"  MSE (Mean Sq. Error)   : {mse:.4f}")
    print("=" * 50)

    results_path = os.path.join(BASE_DIR, "stage1_metrics.txt")
    with open(results_path, "w") as f:
        f.write("STAGE 1 METRICS — YOLOv10 (Baseline)\n")
        f.write("=" * 40 + "\n")
        f.write(f"Total Images Processed : {total_images}\n")
        f.write(f"MAE (Mean Abs. Error)  : {mae:.4f}\n")
        f.write(f"MSE (Mean Sq. Error)   : {mse:.4f}\n")

    print(f"\nResults saved to: stage1_metrics.txt")
else:
    print("No images were processed. Please verify the dataset paths.")
