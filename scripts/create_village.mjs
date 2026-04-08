const data = {
  slug: "test-village-" + Date.now(),
  name: "Làng Test",
  fullName: "Làng Văn Hóa Test",
  address: "Xã Test, Hà Nội",
  logoUrl: "",
  facebookUrl: "",
  zaloUrl: "",
  emergencyPolicePhone: "0965305720",
  emergencyHealthPhone: "0965305720"
};

async function create() {
  try {
    const res = await fetch("http://localhost:3000/api/villages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(err);
  }
}

create();
