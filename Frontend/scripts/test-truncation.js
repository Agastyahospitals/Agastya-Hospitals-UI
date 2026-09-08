import axios from "axios";

async function test() {
  try {
    const res = await axios.get("https://agastya-hospitals-backend.onrender.com/api/specialities");
    const specialty = res.data[0];
    console.log("Specialty:", specialty.specialityName);
    const html = specialty.pageDescription;
    console.log("Original HTML length:", html.length);
    
    // Test regex / DOM-less fallback or logic
    const textOnly = html.replace(/<[^>]*>/g, "");
    console.log("Plain text length:", textOnly.length);
  } catch (e) {
    console.error(e.message);
  }
}

test();
