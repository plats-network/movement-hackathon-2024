import time
time.sleep(30)
env_path = "/root/.config/nillion/nillion-devnet.env"
with open(env_path, "r") as f:
    text = f.read()
    print(text)
