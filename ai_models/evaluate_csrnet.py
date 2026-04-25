import os
import torch
import torch.nn as nn
import scipy.io as sio
from PIL import Image
import torchvision.transforms.functional as F


# ----------------------------------------------------
# 1. CSRNet ARCHITECTURE (PyTorch)
# ----------------------------------------------------
class CSRNet(nn.Module):
    def __init__(self):
        super(CSRNet, self).__init__()
        self.frontend = self.make_layers([64, 64, 'M', 128, 128, 'M', 256, 256, 256, 'M', 512, 512, 512])
        self.backend = self.make_layers([512, 512, 512, 256, 128, 64], in_channels=512, dilation=True)
        self.output_layer = nn.Conv2d(64, 1, kernel_size=1)

    def forward(self, x):
        x = self.frontend(x)
        x = self.backend(x)
        x = self.output_layer(x)
        return x

    def make_layers(self, cfg, in_channels=3, dilation=False):
        d_rate = 2 if dilation else 1
        layers = []
        for v in cfg:
            if v == 'M':
                layers += [nn.MaxPool2d(kernel_size=2, stride=2)]
            else:
                conv2d = nn.Conv2d(in_channels, v, kernel_size=3, padding=d_rate, dilation=d_rate)
                layers += [conv2d, nn.ReLU(inplace=True)]
                in_channels = v
        return nn.Sequential(*layers)


# ----------------------------------------------------
# 2. PATH SETUP & MODEL INITIALIZATION
# ----------------------------------------------------
BASE_DIR        = os.path.dirname(os.path.abspath(__file__))
TEST_IMAGES_DIR = os.path.join(BASE_DIR, "part_B", "test_data", "images")
TEST_GT_DIR     = os.path.join(BASE_DIR, "part_B", "test_data", "ground-truth")
WEIGHTS_PATH    = os.path.join(BASE_DIR, "partBmodel_best.pth.tar")

print("Initializing CSRNet model...")
model = CSRNet()

if os.path.exists(WEIGHTS_PATH):
    print(f"Loading pre-trained weights from: {WEIGHTS_PATH}")
    checkpoint = torch.load(WEIGHTS_PATH, map_location=torch.device('cpu'), weights_only=False)
    model.load_state_dict(checkpoint['state_dict'])
    print("Weights loaded successfully.")
else:
    print(f"ERROR: Weights file not found at '{WEIGHTS_PATH}'. Aborting.")
    exit(1)

model.eval()

mae_sum      = 0
mse_sum      = 0
total_images = 0

print("\nStarting CSRNet evaluation on ShanghaiTech Part B test set...")
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

    try:
        # A. Load ground truth count from .mat file
        mat           = sio.loadmat(mat_path)
        actual_count  = len(mat['image_info'][0, 0][0, 0][0])

        # B. Run CSRNet inference — output is a density map; sum gives total count
        img        = Image.open(img_path).convert('RGB')
        img_tensor = F.to_tensor(img).unsqueeze(0)

        with torch.no_grad():
            output          = model(img_tensor)
            predicted_count = int(output.sum().item())

        # C. Compute per-image error
        abs_err = abs(actual_count - predicted_count)
        sq_err  = abs_err ** 2

        mae_sum      += abs_err
        mse_sum      += sq_err
        total_images += 1

        print(f"  {img_name:<15} | Actual: {actual_count:>4} | Predicted: {predicted_count:>4} | Error: {abs_err:>4}")

    except Exception as e:
        print(f"  [ERROR] Failed to process {img_name}: {e}")


# ----------------------------------------------------
# 4. FINAL METRICS & RESULTS
# ----------------------------------------------------
print("-" * 60)

if total_images > 0:
    mae = mae_sum / total_images
    mse = mse_sum / total_images

    print("\n" + "=" * 50)
    print("  STAGE 2 RESULTS — CSRNet (Density Estimation)")
    print("=" * 50)
    print(f"  Total Images Processed : {total_images}")
    print(f"  MAE (Mean Abs. Error)  : {mae:.4f}")
    print(f"  MSE (Mean Sq. Error)   : {mse:.4f}")
    print("=" * 50)

    results_path = os.path.join(BASE_DIR, "stage2_metrics.txt")
    with open(results_path, "w") as f:
        f.write("STAGE 2 METRICS — CSRNet (Density Estimation)\n")
        f.write("=" * 40 + "\n")
        f.write(f"Total Images Processed : {total_images}\n")
        f.write(f"MAE (Mean Abs. Error)  : {mae:.4f}\n")
        f.write(f"MSE (Mean Sq. Error)   : {mse:.4f}\n")

    print(f"\nResults saved to: stage2_metrics.txt")
else:
    print("No images were processed. Please verify the dataset paths.")
