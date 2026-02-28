import streamlit as st
import google.generativeai as genai
from PIL import Image

# 1. Securely Load API Key
genai.configure(api_key=st.secrets["GEMINI_API_KEY"])

# 2. Initialize the Nano Banana 2 Model
# Note: In the SDK, it is often referenced by its technical ID
model = genai.GenerativeModel('gemini-3.1-flash-image')

def generate_tryon(person_img, dress_img):
    prompt = """
    Identify the person in the first image and the outfit in the second image. 
    Create a high-fidelity photo of the person from the first image wearing 
    the exact outfit from the second image. Maintain the person's pose, 
    body shape, and facial features. Ensure the fabric texture and fit 
    look realistic.
    """
    
    # Nano Banana 2 supports sending multiple images in one list
    response = model.generate_content([prompt, person_img, dress_img])
    return response.generated_image

# --- Streamlit UI ---
st.title("👗 Virtual Fitting Room")
# (Upload logic here...)

if st.button("Generate Look"):
    # Convert uploaded files to PIL Images
    p_img = Image.open(user_file)
    d_img = Image.open(dress_file)
    
    result = generate_tryon(p_img, d_img)
    st.image(result, caption="Your Virtual Try-On Result")
