import argparse, csv, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
AI_SERVICE = ROOT / "AI-Service"
if str(AI_SERVICE) not in sys.path:
    sys.path.insert(0, str(AI_SERVICE))

import numpy as np, torch
from torch import nn
from torch.utils.data import Dataset, DataLoader
from sklearn.metrics import classification_report, confusion_matrix, f1_score, accuracy_score
from app.model import SignLSTM

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "AI-Service"))
MANIFEST=ROOT/"dataset"/"manifests"/"all_manifest.csv"
LABEL_FILE=ROOT/"dataset"/"labels"/"psl_words.csv"
ART=ROOT/"AI-Service"/"artifacts"; MODEL=ROOT/"AI-Service"/"models"/"psl_lstm.pt"

class SeqDataset(Dataset):
    def __init__(self, rows, label_to_id):
        self.rows=rows; self.map=label_to_id
    def __len__(self): return len(self.rows)
    def __getitem__(self,i):
        r=self.rows[i]; x=np.load(ROOT/r["path"]).astype(np.float32)
        return torch.from_numpy(x), torch.tensor(self.map[r["label"]],dtype=torch.long)

def main():
    p=argparse.ArgumentParser(); p.add_argument("--epochs",type=int,default=40); p.add_argument("--batch-size",type=int,default=32); p.add_argument("--lr",type=float,default=1e-3); args=p.parse_args()
    if not MANIFEST.exists(): raise SystemExit("Run augment_dataset.py first.")
    with MANIFEST.open(newline="",encoding="utf-8") as f: rows=list(csv.DictReader(f))
    labels=sorted(set(r["label"] for r in rows))
    mapping={v:i for i,v in enumerate(labels)}
    splits={s:[r for r in rows if r["split"]==s] for s in ["train","val","test"]}
    if any(not splits[s] for s in splits): raise SystemExit("Train/val/test split is empty.")
    device="cuda" if torch.cuda.is_available() else "cpu"
    train=DataLoader(SeqDataset(splits["train"],mapping),batch_size=args.batch_size,shuffle=True)
    val=DataLoader(SeqDataset(splits["val"],mapping),batch_size=args.batch_size)
    model=SignLSTM(len(labels)).to(device); opt=torch.optim.AdamW(model.parameters(),lr=args.lr); loss_fn=nn.CrossEntropyLoss()
    best=-1
    for epoch in range(args.epochs):
        model.train(); total=0
        for x,y in train:
            x,y=x.to(device),y.to(device); opt.zero_grad(); loss=loss_fn(model(x),y); loss.backward(); opt.step(); total+=loss.item()
        model.eval(); ys=[]; ps=[]
        with torch.no_grad():
            for x,y in val:
                pred=model(x.to(device)).argmax(1).cpu().numpy(); ps.extend(pred); ys.extend(y.numpy())
        score=f1_score(ys,ps,average="macro",zero_division=0)
        print(f"Epoch {epoch+1}/{args.epochs} loss={total/max(1,len(train)):.4f} val_macro_f1={score:.4f}")
        if score>best:
            best=score; MODEL.parent.mkdir(parents=True,exist_ok=True)
            torch.save({"state_dict":model.cpu().state_dict(),"labels":labels},MODEL); model.to(device)
    # Evaluate once on held-out test split.
    payload=torch.load(MODEL,map_location=device,weights_only=False); model.load_state_dict(payload["state_dict"]); model.eval()
    test=DataLoader(SeqDataset(splits["test"],mapping),batch_size=args.batch_size); ys=[]; ps=[]
    with torch.no_grad():
        for x,y in test: ps.extend(model(x.to(device)).argmax(1).cpu().numpy()); ys.extend(y.numpy())
    ART.mkdir(parents=True,exist_ok=True)
    report=classification_report(ys,ps,labels=list(range(len(labels))),target_names=labels,output_dict=True,zero_division=0)
    metrics={"test_accuracy":accuracy_score(ys,ps),"test_macro_f1":f1_score(ys,ps,average="macro",zero_division=0),"labels":labels,"classification_report":report,"confusion_matrix":confusion_matrix(ys,ps).tolist(),"counts":{"train":len(splits["train"]),"val":len(splits["val"]),"test":len(splits["test"])}}
    (ART/"metrics.json").write_text(json.dumps(metrics,indent=2),encoding="utf-8")
    print(json.dumps({k:metrics[k] for k in ["test_accuracy","test_macro_f1","counts"]},indent=2))
if __name__=="__main__": main()
