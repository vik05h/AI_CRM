import cv2
from PIL import Image
import os

def create_walkthrough_gif():
    video_path = os.path.join(os.path.dirname(__file__), 'videos', 'ai_crm_walkthrough.webm')
    gif_path = os.path.join(os.path.dirname(__file__), 'videos', 'ai_crm_walkthrough.gif')
    mp4_path = os.path.join(os.path.dirname(__file__), 'videos', 'ai_crm_walkthrough.mp4')
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"Error opening {video_path}")
        return

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0
    print(f"Total frames: {total_frames}, FPS: {fps}")

    # We want a smooth, fast-paced walkthrough GIF (~120 frames, ~10 fps display speed, 100ms per frame)
    # Target 800px width for crystal-clear readability in GitHub README
    target_width = 800
    
    frames = []
    # Sample every 10th frame to cover the entire 51-second recording in ~12 seconds
    step = 10
    frame_idx = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_idx % step == 0:
            # Convert BGR to RGB
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            h, w = rgb.shape[:2]
            target_height = int(h * (target_width / w))
            resized = cv2.resize(rgb, (target_width, target_height), interpolation=cv2.INTER_AREA)
            
            img = Image.fromarray(resized)
            # Quantize with adaptive palette for crisp text and tiny file size
            img_quantized = img.quantize(colors=128, method=Image.Quantize.MEDIANCUT)
            frames.append(img_quantized)
            
        frame_idx += 1

    cap.release()
    print(f"Extracted {len(frames)} frames. Saving animated GIF...")

    if frames:
        frames[0].save(
            gif_path,
            save_all=True,
            append_images=frames[1:],
            duration=120, # 120ms per frame
            loop=0,
            optimize=True
        )
        size_mb = os.path.getsize(gif_path) / (1024 * 1024)
        print(f"GIF saved successfully to {gif_path} ({size_mb:.2f} MB)")

if __name__ == '__main__':
    create_walkthrough_gif()
