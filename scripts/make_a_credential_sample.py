import os

dirname = os.path.dirname(__file__)
output_file = os.path.join(dirname, "../credential_sample.csv")
columns = ["identifier_code", "name"]

def create_csv_file():
    with open(output_file, "w") as csv_file:
      pass

def populate_credential_file(csv_file):
  csv_file.write(",".join(columns) + "\n")
  for i in range(1, 10001):
    csv_file.write(f"{i},credential#{i}\n")

def override_credential_file():
  with open(output_file, "w") as csv_file:
    populate_credential_file(csv_file)
    csv_file.close()

def make_credential_sample():
  if not os.path.exists(output_file):
    create_csv_file();
  override_credential_file()

make_credential_sample()