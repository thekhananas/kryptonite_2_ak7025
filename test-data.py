import numpy as np

# --- 1. Load the data ---
try:
    selected_n_value = 10

    data = np.load('Datasets/kryptonite-%s-X.npy'%(selected_n_value))
    # data = np.load('')
    
    # --- 2. Inspect the data (CRITICAL STEP) ---
    print(f"Successfully loaded 'npy'")
    print(f"Data shape: {data.shape}")     # e.g., (50,), (100, 100), (64, 64, 3)
    print(f"Data type: {data.dtype}")       # e.g., float64, uint8
    print(f"Dimensions: {data.ndim}")       # e.g., 1, 2, 3
    print(f"Min value: {data.min()}")
    print(f"Max value: {data.max()}")

except FileNotFoundError:
    print("Error: The file 'your_file.npy' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")