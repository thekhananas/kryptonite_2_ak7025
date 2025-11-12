import numpy as np

# --- 1. Load your .npy file ---
print("Loading 'your_file.npy'...")
try:
    selected_n_value = 10

    data = np.load('Datasets/kryptonite-%s-X.npy'%(selected_n_value))
    # data = np.load('')


    # --- 2. Save as a .csv file ---
    output_filename = 'output_data.csv'
    print(f"Saving data to '{output_filename}'...")

    np.savetxt(
        output_filename,    # The name of the file to save
        data,               # The numpy array to save
        delimiter=",",      # Use a comma to separate values
        fmt="%.8f",         # Format: floating point with 8 decimal places
        header="col_1,col_2,col_3,col_4,col_5,col_6,col_7,col_8,col_9,col_10", # Optional header
        comments=""         # Disables comments (headers are often prefixed with #)
    )

    print("File saved successfully.")

except FileNotFoundError:
    print("Error: The file 'your_file.npy' was not found.")
except Exception as e:
    print(f"An error occurred: {e}")