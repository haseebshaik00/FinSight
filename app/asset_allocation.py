import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.covariance import LedoitWolf
import torch
import torch.nn as nn

class AttentionLSTM(nn.Module):
    def __init__(self, input_dim=1, hidden_dim=64, output_dim=1):
        super(AttentionLSTM, self).__init__()
        self.lstm = nn.LSTM(input_dim, hidden_dim, batch_first=True)
        self.attn = nn.Linear(hidden_dim, 1)
        self.fc = nn.Linear(hidden_dim, output_dim)

    def attention(self, lstm_output):
        weights = torch.softmax(self.attn(lstm_output).squeeze(-1), dim=1)
        context = torch.bmm(weights.unsqueeze(1), lstm_output).squeeze(1)
        return context

    def forward(self, x):
        lstm_out, _ = self.lstm(x)
        context = self.attention(lstm_out)
        return self.fc(context)

def load_asset_data(folder_path, max_len=60):
    data_dict = {}
    for fname in os.listdir(folder_path):
        if fname.endswith('.csv'):
            df = pd.read_csv(os.path.join(folder_path, fname))
            if 'Close' not in df.columns:
                continue
            prices = df['Close'].values[-max_len:]
            if len(prices) < max_len:
                continue
            norm = MinMaxScaler().fit_transform(prices.reshape(-1, 1))
            tensor_data = torch.tensor(norm, dtype=torch.float32).unsqueeze(0)
            data_dict[fname[:-4]] = tensor_data
    return data_dict

def forecast_returns(data_dict, model):
    model.eval()
    predictions = {}
    with torch.no_grad():
        for symbol, series in data_dict.items():
            predictions[symbol] = model(series).item()
    return predictions

def pick_top_n(returns_dict, n=3):
    return dict(sorted(returns_dict.items(), key=lambda x: x[1], reverse=True)[:n])

def allocate_by_risk(savings, profile):
    table = {
        'Conservative': {'stocks': 0.2, 'mutual': 0.2, 'crypto': 0.05, 'bonds': 0.35, 'gold': 0.2},
        'Balanced':     {'stocks': 0.35, 'mutual': 0.25, 'crypto': 0.15, 'bonds': 0.15, 'gold': 0.1},
        'Aggressive':   {'stocks': 0.45, 'mutual': 0.15, 'crypto': 0.25, 'bonds': 0.05, 'gold': 0.1},
    }
    return {k: v * savings for k, v in table[profile].items()}

def run_pipeline(savings, risk_profile):
    base_path = os.path.dirname(os.path.abspath(__file__))
    model_root=os.path.join(base_path, "..", "ml-engine")
    data_root = os.path.join(base_path, "ml-engine", "data")


    asset_folders = {
        'stocks': os.path.join(data_root, "historical-data", "stocks"),
        'mutual': os.path.join(data_root, "historical-data", "mutual-funds"),
        'crypto': os.path.join(data_root, "historical-data", "crypto"),
        'bonds':  os.path.join(data_root, "historical-data", "bonds"),
        'gold':   os.path.join(data_root, "historical-data", "gold")
    }

    model = AttentionLSTM()
    model_path = os.path.join(base_path, "ml-engine", "trained-attention-lstm.pth")

    print(model_path)
    model.load_state_dict(torch.load(model_path, map_location='cpu'))


    allocation = allocate_by_risk(savings, risk_profile)
    final_output = {}

    for cls, path in asset_folders.items():
        asset_data = load_asset_data(path)
        if not asset_data:
            continue
        preds = forecast_returns(asset_data, model)

        if len(preds) > 1:
            cov = LedoitWolf().fit(np.random.randn(len(preds), 60)).covariance_
            top3 = pick_top_n(preds)
        else:
            top3 = list(preds.keys())

        total_class_amt = allocation[cls]
        top3_preds = {k: preds[k] for k in top3}
        scaled_preds = {k: np.exp(v * 10) for k, v in top3_preds.items()}
        total_scaled = sum(scaled_preds.values())

        weighted_alloc = {
            k: total_class_amt * (v / total_scaled)
            for k, v in scaled_preds.items()
        }

        final_output[cls] = {
            'allocation': round(total_class_amt, 2),
            'top_assets': {k: round(v, 2) for k, v in weighted_alloc.items()}
        }
    return final_output