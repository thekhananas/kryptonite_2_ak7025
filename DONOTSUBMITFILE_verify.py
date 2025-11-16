"""Verify submission meets all requirements"""

import os
import numpy as np


def verify_submission():
    """This is to verify the submission requirements"""
    print("Verifying submission requirements...")
    # Check hidden labels
    print("\n1. Checking hidden labels...")
    for n in [10, 12, 14, 16, 18, 20]:
        path = f"hiddenlabels/y_predicted_{n}.npy"
        if os.path.exists(path):
            y = np.load(path)
            assert len(y) == 10000, f"n={n}: Expected 10000 predictions, got {len(y)}"
            assert y.dtype in [np.int32, np.int64], f"n={n}: Must be integers"
            assert set(np.unique(y)) <= {0, 1}, f"n={n}: Must be binary"
            print(f"  ✓ n={n}: Valid ({np.mean(y):.3f} positive rate)")
        else:
            print(f"  ✗ n={n}: Missing file")

    # Check figures
    print("\n2. Checking figures...")
    required_figures = [
        "figures/dataset_overview.png",
        "figures/performance_comparison.png",
        "figures/learning_curves.png",
    ]
    for fig in required_figures:
        if os.path.exists(fig):
            print(f"  ✓ {fig}")
        else:
            print(f"  ✗ {fig} missing")

    print("\n✅ Verification complete!")


if __name__ == "__main__":
    verify_submission()
